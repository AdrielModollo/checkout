import { Injectable } from '@nestjs/common';
import { logger } from '../communs/logger.winston';
import { PaymentService } from './payment.service';
import { RmqService } from '../config/rabbitMq/rabbitMq.service';
import { OrderService } from './order.service';

@Injectable()
export class ConsumerQueueService {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
        private readonly rmqService: RmqService,
    ) { }

    async consumerQueuePayment(queueName): Promise<void> {
        await this.rmqService.consumePaymentQueue(queueName, async (message: string) => {
            try {
                const createPaymentDto = await this.parsePaymentMessage(message);
                await this.consumerQueueCheckout(createPaymentDto);
            } catch (error) {
                logger.error(`Error processing payment message: ${error.message}`);
            }
        });
    }

    async consumerQueueCheckout(createPaymentDto): Promise<void> {
        await this.paymentService.createPayment(createPaymentDto);
        await this.orderService.updateOrder(createPaymentDto);
    }

    private async parsePaymentMessage(message: string): Promise<any> {
        try {
            const parsedMessage = JSON.parse(message);

            if (!parsedMessage.orderId || !parsedMessage.status) {
                throw new Error('Invalid payment message format');
            }

            return parsedMessage;
        } catch (error) {
            logger.error(`Error parsing payment message: ${error.message}`);
            throw new Error('Invalid payment message format');
        }
    }
}