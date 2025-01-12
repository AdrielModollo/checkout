import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../app/entities/payment.entity';
import { PaymentService } from '../app/services/payment.service';
import { PaymentDto } from '../app/dto/createPayment.dto';
import { logger } from '../app/communs/logger.winston';

jest.mock('../app/communs/logger.winston');

describe('PaymentService', () => {
    let service: PaymentService;
    let paymentRepository: Repository<Payment>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: getRepositoryToken(Payment),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        paymentRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a payment successfully', async () => {
        const createPaymentDto: PaymentDto = { orderId: 1, status: 'COMPLETED' };

        const orderMock = { id: 1 } as any;
        const savedPayment: Payment = { id: 1, ...createPaymentDto, order: orderMock };

        jest.spyOn(paymentRepository, 'save').mockResolvedValue(savedPayment);
        const logInfoSpy = jest.spyOn(logger, 'info');

        const result = await service.createPayment(createPaymentDto);

        expect(paymentRepository.save).toHaveBeenCalledWith(expect.objectContaining(createPaymentDto));
        expect(logInfoSpy).toHaveBeenCalledWith(`Payment created successfully: ${JSON.stringify(savedPayment)}`);
        expect(result).toEqual(savedPayment);
    });

    it('should log an error if payment creation fails', async () => {
        const createPaymentDto: PaymentDto = { orderId: 1, status: 'COMPLETED' };

        jest.spyOn(paymentRepository, 'save').mockRejectedValue(new Error('Database error'));
        const logErrorSpy = jest.spyOn(logger, 'error');

        await expect(service.createPayment(createPaymentDto)).rejects.toThrowError('Database error');

        expect(paymentRepository.save).toHaveBeenCalledWith(expect.objectContaining(createPaymentDto));
        expect(logErrorSpy).toHaveBeenCalledWith('Error creating payment: Database error');
    });
});
