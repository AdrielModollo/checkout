import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/entities/order.entity';
import { AuthGuard } from '../services/auth.guard.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('create')
    @UseGuards(AuthGuard)
    async createOrder(
        @Body() body: { clientId: number; amount: number; status: string },
    ): Promise<Order> {
        return this.orderService.createOrder(body.clientId, body.amount, body.status);
    }
}
