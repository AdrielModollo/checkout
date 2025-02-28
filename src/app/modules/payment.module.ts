import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../entities/payment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule { }
