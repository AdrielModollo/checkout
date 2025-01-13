import { Module } from '@nestjs/common';
import { CheckoutPaymentModule } from './app/modules/checkout.payment.module';
import { RmqService } from './app/config/rabbitMq/rabbitMq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../ormconfig';
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                ...AppDataSource.options,
            }),
        }),
        CheckoutPaymentModule,
    ],
    providers: [RmqService],
})
export class AppModule { }
