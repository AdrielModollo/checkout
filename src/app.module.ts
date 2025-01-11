import { Module } from '@nestjs/common';
import { CheckoutModule } from './app/modules/checkout.module';
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
        CheckoutModule,
    ],
    providers: [RmqService],
})
export class AppModule { }
