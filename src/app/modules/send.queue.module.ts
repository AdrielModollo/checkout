import { Module } from '@nestjs/common';
import { RmqModule } from './rabbitMq.module';
import { SendQueueService } from '../services/sendQueue.service';

@Module({
    imports: [
        RmqModule,
    ],
    providers: [SendQueueService],
    exports: [SendQueueService],
})
export class SendQueueModule { }
