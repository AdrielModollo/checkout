import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { Order } from 'src/app/entities/order.entity';
import { AuthGuard } from '../services/auth.guard.service';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderSwagger } from '../swagger/order.swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('checkout')
export class OrderController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('order')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Checkout a new order' })
    @ApiBody(OrderSwagger.createOrderApiBody)
    @ApiResponse(OrderSwagger.createOrderApiResponse[0])
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.checkoutService.checkoutOrder(createOrderDto);
    }
}
