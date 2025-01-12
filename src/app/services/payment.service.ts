import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { logger } from '../communs/logger.winston';
import { PaymentDto } from '../dto/createPayment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
    ) { }

    async createPayment(createPaymentDto: PaymentDto): Promise<Payment> {
        try {
            const payment = new Payment();
            payment.orderId = createPaymentDto.orderId;
            payment.status = createPaymentDto.status;

            const savedPayment = await this.paymentRepository.save(payment);

            logger.info(`Payment created successfully: ${JSON.stringify(savedPayment)}`);

            return savedPayment;
        } catch (error) {
            logger.error(`Error creating payment: ${error.message}`);
            throw error;
        }
    }
}
