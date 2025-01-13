import { Module } from '@nestjs/common';
import { PaymentModule } from './payment.module';
import { OrderModule } from './order.module';
import { RmqModule } from './rabbitMq.module';
import { ConsumerQueueService } from '../services/consumerQueue.service';

@Module({
    imports: [
        PaymentModule,
        OrderModule,
        RmqModule,
    ],
    providers: [ConsumerQueueService],
    exports: [ConsumerQueueService],
})
export class ConsumerQueueModule { }
