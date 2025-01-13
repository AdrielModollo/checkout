import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { logger } from '../../communs/logger.winston';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    private maxRetries = 5;
    private retryDelay = 5000;

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.close();
    }

    private async connect(retryCount = 0): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue('checkout');
        } catch (error) {
            logger.error(`Error connecting to RabbitMQ: ${error.message}`);

            if (retryCount < this.maxRetries) {
                logger.error(`Retrying connection... Attempt ${retryCount + 1} of ${this.maxRetries}`);

                await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                await this.connect(retryCount + 1);
            } else {
                logger.error('Maximum connection attempts to RabbitMQ reached.');
            }
        }
    }

    async sendOrder(queueName: string, orderId: number, amount: number, status: string): Promise<void> {
        if (!this.channel) {
            logger.error('Channel is not available for sending messages.');
            return;
        }

        try {
            const message = JSON.stringify({ orderId, amount, status });

            await this.channel.assertQueue(queueName, { durable: true });

            this.channel.sendToQueue(queueName, Buffer.from(message));
            logger.info(`Message sent to the '${queueName}' queue: ${message}`);
        } catch (error) {
            logger.error(`Error sending message to the '${queueName}' queue: ${error.message}`);
        }
    }

    async consumePaymentQueue(queueName: string, callback: (message: any) => Promise<void>): Promise<void> {
        if (!this.channel) {
            logger.error('Channel is not available for consuming messages.');
            return;
        }

        try {
            await this.channel.consume(queueName, async (msg) => {
                if (msg) {
                    const messageContent = msg.content.toString();
                    logger.info(`Message received from the '${queueName}' queue: ${messageContent}`);

                    await callback(messageContent);

                    this.channel.ack(msg);
                }
            });
        } catch (error) {
            logger.error(`Error consuming messages from the '${queueName}' queue: ${error.message}`);
        }
    }

    private async close(): Promise<void> {
        try {
            await this.channel.close();
            await this.connection.close();
        } catch (error) {
            logger.error(`Error closing the RabbitMQ connection: ${error.message}`);
        }
    }
}
