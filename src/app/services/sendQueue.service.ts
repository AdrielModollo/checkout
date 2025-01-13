import { Injectable } from '@nestjs/common';
import { RmqService } from '../config/rabbitMq/rabbitMq.service';

@Injectable()
export class SendQueueService {
    constructor(
        private readonly rmqService: RmqService,
    ) { }

    async sendOrder(orderId: number, amount: number, status: string): Promise<void> {
        const queueName = 'checkout';
        await this.rmqService.sendOrder(queueName, orderId, amount, status);
    }
}
