import { Module } from '@nestjs/common';
import { CheckoutModule } from './checkout.order.module';
import { PaymentModule } from './payment.module';
import { AuthModule } from './auth.module';
import { RmqModule } from './rabbitMq.module';
import { ConsumerQueueModule } from './consumer.queue.module';
import { OrderModule } from './order.module';
import { SendQueueModule } from './send.queue.module';

@Module({
    imports: [
        CheckoutModule,
        OrderModule,
        PaymentModule,
        AuthModule,
        RmqModule,
        ConsumerQueueModule,
        SendQueueModule
    ],
})
export class CheckoutPaymentModule { }
