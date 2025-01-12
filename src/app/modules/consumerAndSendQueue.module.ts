import { Module } from '@nestjs/common';
import { ConsumerAndSendQueueService } from '../services/consumerAndSendQueue.service';
import { PaymentModule } from './payment.module';
import { UpdatePaymentOrderModule } from './updatePaymentOrder.module';
import { RmqModule } from './rabbitMq.module';

@Module({
    imports: [
        PaymentModule,
        UpdatePaymentOrderModule,
        RmqModule,
    ],
    providers: [ConsumerAndSendQueueService],
    exports: [ConsumerAndSendQueueService],
})
export class ConsumerAndSendQueueModule { }
