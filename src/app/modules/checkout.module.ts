import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from '../services/order.service';
import { OrderController } from '../controllers/order.controller';
import { Order } from '../entities/order.entity';
import { RmqService } from '../config/rabbitMq/rabbitMq.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../services/auth.guard.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Order]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [OrderService, RmqService, AuthGuard],
    controllers: [OrderController],
})
export class CheckoutModule { }
