import { ApiResponseOptions } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/createOrder.dto';

export class OrderSwagger {
    static createOrderApiBody: ApiResponseOptions = {
        description: 'Dados para criação do pedido',
        type: CreateOrderDto,
    };

    static createOrderApiResponse: ApiResponseOptions[] = [
        {
            status: 201,
            description: 'Order created successfully',
            type: Order,
        },
        {
            status: 400,
            description: 'Error creating order',
        },
    ];
}
