import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/app/entities/order.entity';
import { RmqService } from 'src/app/config/rabbitMq/rabbitMq.service';
import { logger } from '../communs/logger.winston';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly rmqService: RmqService,
    ) { }

    async createOrder(createOrderDto): Promise<Order> {
        try {
            const order = new Order();
            order.clientId = createOrderDto.clientId;
            order.amount = createOrderDto.amount;
            order.status = createOrderDto.status;

            const savedOrder = await this.orderRepository.save(order);
            logger.info(`Order created successfully: ${JSON.stringify(savedOrder)}`);
            await this.rmqService.sendOrderStatus(order.id, order.status);

            return savedOrder;
        } catch (error) {
            logger.error(`Error creating order: ${error.message}`);
        }
    }
}
