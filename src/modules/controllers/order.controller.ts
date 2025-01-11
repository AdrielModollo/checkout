import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from 'src/modules/entities/order.entity';

@Controller('order')
export class OrderController {
    constructor(private readonly checkoutService: OrderService) { }

    @Post('create')
    async createOrder(
        @Body() body: { clientId: number; amount: number, status: string },
    ): Promise<Order> {
        return this.checkoutService.createOrder(body.clientId, body.amount, body.status);
    }
}
