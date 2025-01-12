import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { ConsumerAndSendQueueModule } from './consumerAndSendQueue.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        AuthModule,
        ConfigModule.forRoot(),
        ConsumerAndSendQueueModule
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }
