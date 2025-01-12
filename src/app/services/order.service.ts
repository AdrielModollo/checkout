import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { logger } from '../communs/logger.winston';
import { ConsumerAndSendQueueService } from './consumerAndSendQueue.service';
import { CreateOrderDto } from '../dto/createOrder.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly consumerAndSendQueueService: ConsumerAndSendQueueService,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        try {
            const order = new Order();
            order.clientId = createOrderDto.clientId;
            order.amount = createOrderDto.amount;
            order.status = createOrderDto.status;

            const savedOrder = await this.orderRepository.save(order);
            logger.info(`Order created successfully: ${JSON.stringify(savedOrder)}`);

            await this.consumerAndSendQueueService.sendOrderStatus(savedOrder.id, savedOrder.status);

            return savedOrder;
        } catch (error) {
            logger.error(`Error creating order: ${error.message}`);
            throw error;
        }
    }
}
