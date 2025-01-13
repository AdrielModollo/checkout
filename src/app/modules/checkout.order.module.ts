import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../controllers/order.controller';
import { CheckoutService } from '../services/checkout.service';
import { Order } from '../entities/order.entity';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { ConsumerQueueModule } from './consumer.queue.module';
import { SendQueueModule } from './send.queue.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        AuthModule,
        ConfigModule.forRoot(),
        SendQueueModule,
        ConsumerQueueModule
    ],
    controllers: [OrderController],
    providers: [CheckoutService],
    exports: [CheckoutService],
})
export class CheckoutModule { }
