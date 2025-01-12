import { Injectable } from '@nestjs/common';
import { logger } from '../communs/logger.winston';
import { PaymentService } from './payment.service';
import { RmqService } from '../config/rabbitMq/rabbitMq.service';
import { UpdatePaymentOrderService } from './updatePaymentOrder.service';

@Injectable()
export class ConsumerAndSendQueueService {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly rmqService: RmqService,
        private readonly updatePaymentAndOrderService: UpdatePaymentOrderService,
    ) { }

    async sendOrderStatus(orderId: number, status: string): Promise<void> {
        const queueName = 'checkout';
        await this.rmqService.sendOrderStatus(queueName, orderId, status);
        await this.consumerQueuePayment('payment');
    }

    async consumerQueuePayment(queueName): Promise<void> {
        console.log('Iniciando consumo da fila...');
        await this.rmqService.consumePaymentQueue(queueName, async (message: string) => {
            console.log('Mensagem recebida:', message);
            try {
                const createPaymentDto = await this.parsePaymentMessage(message);
                console.log('Mensagem processada:', createPaymentDto);
                await this.consumerQueueCheckout(createPaymentDto);
            } catch (error) {
                logger.error(`Error processing payment message: ${error.message}`);
            }
        });
    }

    async consumerQueueCheckout(createPaymentDto): Promise<void> {
        await this.paymentService.createPayment(createPaymentDto);
        await this.updatePaymentAndOrderService.updateOrder(createPaymentDto);
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
