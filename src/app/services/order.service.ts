import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/app/entities/order.entity';
import { RmqService } from 'src/app/config/rabbitMq/rabbitMq.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly rmqService: RmqService,
    ) { }

    async createOrder(clientId: number, amount: number, status: string): Promise<Order> {
        const order = new Order();
        order.clientId = clientId;
        order.amount = amount;
        order.status = status;

        await this.orderRepository.save(order);

        await this.rmqService.sendOrderStatus(order.id, order.status);

        return order;
    }
}
