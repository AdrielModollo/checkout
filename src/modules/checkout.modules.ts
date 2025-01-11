import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../modules/services/order.service';
import { OrderController } from '../modules/controllers/order.controller';
import { Order } from '../modules/entities/order.entity';
import { RmqService } from '../modules/config/rabbitMq/rabbitMq.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [OrderService, RmqService],
    controllers: [OrderController],
})

export class CheckoutModule { }

