import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from 'src/app/entities/order.entity';
import { AuthGuard } from '../services/auth.guard.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderSwagger } from '../swagger/order.swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('create')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Create a new order' })
    @ApiBody(OrderSwagger.createOrderApiBody)
    @ApiResponse(OrderSwagger.createOrderApiResponse[0])
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.orderService.createOrder(createOrderDto);
    }
}
