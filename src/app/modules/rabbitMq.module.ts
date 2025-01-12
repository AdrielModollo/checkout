import { Module } from '@nestjs/common';
import { RmqService } from '../config/rabbitMq/rabbitMq.service';

@Module({
    providers: [RmqService],
    exports: [RmqService],
})
export class RmqModule { }
