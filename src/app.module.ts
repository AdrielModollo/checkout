import { Module } from '@nestjs/common';
import { CheckoutModule } from './modules/checkout.modules';
import { RmqService } from './modules/config/rabbitMq/rabbitMq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../ormconfig';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                ...AppDataSource.options,
            }),
        }),
        CheckoutModule,
    ],
    providers: [RmqService],
})

export class AppModule { }
