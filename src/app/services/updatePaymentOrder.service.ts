import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { logger } from '../communs/logger.winston';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

@Injectable()
export class UpdatePaymentOrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) { }

    async updateOrder(updateOrderDto: UpdateOrderDto): Promise<Order> {
        try {
            const order = await this.orderRepository.findOne({ where: { id: updateOrderDto.orderId } });

            if (!order) {
                logger.error('Order not found:', updateOrderDto.orderId);
                throw new NotFoundException('Order not found');
            }

            order.status = updateOrderDto.status;
            const updatedOrder = await this.orderRepository.save(order);
            logger.info(`Order updated successfully: ${JSON.stringify(updatedOrder)}`);
            return updatedOrder;
        } catch (error) {
            logger.error(`Error updating order: ${error.message}`);
            throw error;
        }
    }
}
