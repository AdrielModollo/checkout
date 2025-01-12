import { Module } from '@nestjs/common';
import { OrderModule } from './order.module';
import { PaymentModule } from './payment.module';
import { AuthModule } from './auth.module';
import { RmqModule } from './rabbitMq.module';
import { ConsumerAndSendQueueModule } from './consumerAndSendQueue.module';

@Module({
    imports: [
        OrderModule,
        PaymentModule,
        AuthModule,
        RmqModule,
        ConsumerAndSendQueueModule,
    ],
})
export class CheckoutModule { }
