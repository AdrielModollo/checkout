import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RmqService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async onModuleInit() {
        await this.connect();
    }

    async onModuleDestroy() {
        await this.close();
    }

    private async connect() {
        try {
            this.connection = await amqp.connect(process.env.RMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue('checkout');
        } catch (error) {
            console.error('Erro ao conectar com o RabbitMQ:', error);
        }
    }

    async sendOrderStatus(orderId: number, status: string) {
        if (!this.channel) {
            console.error('Canal não está disponível para envio de mensagens.');
            return;
        }

        try {
            const message = JSON.stringify({ orderId, status });
            this.channel.sendToQueue('checkout', Buffer.from(message));
            console.log(`Mensagem enviada para a fila 'checkout': ${message}`);
        } catch (error) {
            console.error('Erro ao enviar mensagem para a fila:', error);
        }
    }

    private async close() {
        try {
            await this.channel.close();
            await this.connection.close();
        } catch (error) {
            console.error('Erro ao fechar a conexão RabbitMQ:', error);
        }
    }
}
