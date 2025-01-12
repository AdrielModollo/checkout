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
            logger.error(`Erro ao conectar com o RabbitMQ: ${error.message}`);
            console.error('Erro ao conectar com o RabbitMQ:', error);

            if (retryCount < this.maxRetries) {
                logger.error(`Tentando reconectar... Tentativa ${retryCount + 1} de ${this.maxRetries}`);
                console.log(`Tentando reconectar... Tentativa ${retryCount + 1} de ${this.maxRetries}`);

                await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
                await this.connect(retryCount + 1);
            } else {
                logger.error('Máximo de tentativas de conexão com RabbitMQ atingido.');
                console.error('Máximo de tentativas de conexão com RabbitMQ atingido.');
            }
        }
    }

    async sendOrderStatus(queueName: string, orderId: number, status: string): Promise<void> {
        if (!this.channel) {
            logger.error('Canal não está disponível para envio de mensagens.');
            console.error('Canal não está disponível para envio de mensagens.');
            return;
        }

        try {
            const message = JSON.stringify({ orderId, status });

            await this.channel.assertQueue(queueName, { durable: true });

            this.channel.sendToQueue(queueName, Buffer.from(message));
            logger.info(`Mensagem enviada para a fila '${queueName}': ${message}`);
            console.log(`Mensagem enviada para a fila '${queueName}': ${message}`);
        } catch (error) {
            logger.error(`Erro ao enviar mensagem para a fila '${queueName}': ${error.message}`);
            console.error(`Erro ao enviar mensagem para a fila '${queueName}':`, error);
        }
    }

    async consumePaymentQueue(queueName: string, callback: (message: any) => Promise<void>): Promise<void> {
        if (!this.channel) {
            logger.error('Canal não está disponível para consumo de mensagens.');
            console.error('Canal não está disponível para consumo de mensagens.');
            return;
        }

        try {
            await this.channel.consume(queueName, async (msg) => {
                if (msg) {
                    const messageContent = msg.content.toString();
                    logger.info(`Mensagem recebida da fila '${queueName}': ${messageContent}`);

                    await callback(messageContent);

                    this.channel.ack(msg);
                }
            });
        } catch (error) {
            logger.error(`Erro ao consumir mensagens da fila '${queueName}': ${error.message}`);
            console.error(`Erro ao consumir mensagens da fila '${queueName}':`, error);
        }
    }


    private async close(): Promise<void> {
        try {
            await this.channel.close();
            await this.connection.close();
        } catch (error) {
            logger.error(`Erro ao fechar a conexão RabbitMQ: ${error.message}`);
            console.error('Erro ao fechar a conexão RabbitMQ:', error);
        }
    }
}
