import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { logger } from '../communs/logger.winston';
import { SendQueueService } from './sendQueue.service';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { ConsumerQueueService } from './consumerQueue.service';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly sendQueueService: SendQueueService,
        private readonly consumerQueueService: ConsumerQueueService
    ) { }

    async checkoutOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        try {
            const order = new Order();
            order.clientId = createOrderDto.clientId;
            order.amount = createOrderDto.amount;
            order.status = createOrderDto.status;

            const savedOrder = await this.orderRepository.save(order);
            logger.info(`Order created successfully: ${JSON.stringify(savedOrder)}`);

            await this.sendQueueService.sendOrder(savedOrder.id, savedOrder.amount, savedOrder.status);
            await this.consumerQueueService.consumerQueuePayment('payment');

            return savedOrder;
        } catch (error) {
            logger.error(`Error creating order: ${error.message}`);
            throw error;
        }
    }
}
