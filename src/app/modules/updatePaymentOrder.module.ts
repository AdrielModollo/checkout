import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { UpdatePaymentOrderService } from '../services/updatePaymentOrder.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order])
    ],
    providers: [UpdatePaymentOrderService],
    exports: [UpdatePaymentOrderService],
})
export class UpdatePaymentOrderModule { }
