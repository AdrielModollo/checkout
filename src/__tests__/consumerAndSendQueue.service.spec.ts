import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerAndSendQueueService } from '../app/services/consumerAndSendQueue.service';
import { PaymentService } from '../app/services/payment.service';
import { RmqService } from '../app/config/rabbitMq/rabbitMq.service';
import { UpdatePaymentOrderService } from '../app/services/updatePaymentOrder.service';
import { logger } from '../app/communs/logger.winston';
import { Payment } from '../app/entities/payment.entity';
import { Order } from '../app/entities/order.entity';

jest.mock('../app/communs/logger.winston');
jest.mock('../app/services/payment.service');
jest.mock('../app/services/updatePaymentOrder.service');
jest.mock('../app/config/rabbitMq/rabbitMq.service');

describe('ConsumerAndSendQueueService', () => {
    let service: ConsumerAndSendQueueService;
    let paymentService: PaymentService;
    let rmqService: RmqService;
    let updatePaymentAndOrderService: UpdatePaymentOrderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConsumerAndSendQueueService,
                {
                    provide: PaymentService,
                    useClass: PaymentService,
                },
                {
                    provide: RmqService,
                    useClass: RmqService,
                },
                {
                    provide: UpdatePaymentOrderService,
                    useClass: UpdatePaymentOrderService,
                },
            ],
        }).compile();

        service = module.get<ConsumerAndSendQueueService>(ConsumerAndSendQueueService);
        paymentService = module.get<PaymentService>(PaymentService);
        rmqService = module.get<RmqService>(RmqService);
        updatePaymentAndOrderService = module.get<UpdatePaymentOrderService>(UpdatePaymentOrderService);
    });

    it('should call sendOrderStatus and consumerQueuePayment on sendOrderStatus', async () => {
        const orderId = 1;
        const status = 'COMPLETED';
        const queueName = 'checkout';

        const sendOrderStatusSpy = jest.spyOn(rmqService, 'sendOrderStatus').mockResolvedValue();
        const consumerQueuePaymentSpy = jest.spyOn(service, 'consumerQueuePayment').mockResolvedValue();

        await service.sendOrderStatus(orderId, status);

        expect(sendOrderStatusSpy).toHaveBeenCalledWith(queueName, orderId, status);
        expect(consumerQueuePaymentSpy).toHaveBeenCalledWith('payment');
    });

    it('should process the payment message and call paymentService and updatePaymentAndOrderService', async () => {
        const message = JSON.stringify({ orderId: 1, status: 'COMPLETED' });

        const createPaymentDto: Payment = {
            id: 1,
            orderId: 1,
            status: 'pending',
            order: {
                id: 1,
                status: 'payment_success',
                clientId: 123,
                amount: 100
            } as Order
        };

        const updateOrderDto: Order = {
            id: 1,
            status: 'pending',
            amount: 100,
            clientId: 123
        };

        const consumePaymentQueueSpy = jest.spyOn(rmqService, 'consumePaymentQueue').mockImplementationOnce((queueName, callback) => {
            return Promise.resolve(callback(message));
        });

        jest.spyOn(paymentService, 'createPayment').mockResolvedValue(createPaymentDto);
        jest.spyOn(updatePaymentAndOrderService, 'updateOrder').mockResolvedValue(updateOrderDto);

        await service.consumerQueuePayment('payment');

        expect(consumePaymentQueueSpy).toHaveBeenCalledWith('payment', expect.any(Function));
    });

    it('should log error when parsing an invalid payment message', async () => {
        const invalidMessage = '{"orderId": 1}';

        const logErrorSpy = jest.spyOn(logger, 'error');

        await expect(service['parsePaymentMessage'](invalidMessage)).rejects.toThrowError(
            'Invalid payment message format'
        );

        expect(logErrorSpy).toHaveBeenCalledWith('Error parsing payment message: Invalid payment message format');
    });

    it('should log error if paymentService.createPayment throws an error', async () => {
        const createPaymentDto: Payment = {
            id: 1,
            orderId: 1,
            status: 'COMPLETED',
            order: { id: 1, status: 'PENDING', clientId: 123, amount: 100 } as Order
        } as Payment;

        const logErrorSpy = jest.spyOn(logger, 'error');

        jest.spyOn(paymentService, 'createPayment').mockRejectedValue(new Error('Payment creation failed'));

        await expect(service.consumerQueueCheckout(createPaymentDto)).rejects.toThrowError('Payment creation failed');

        expect(logErrorSpy).toHaveBeenCalledWith('Error parsing payment message: Invalid payment message format');
    });

    it('should log error if updatePaymentAndOrderService.updateOrder throws an error', async () => {
        const updateOrderDto: Order = {
            id: 1,
            status: 'COMPLETED',
            amount: 100,
            clientId: 123
        } as Order;

        const logErrorSpy = jest.spyOn(logger, 'error');

        jest.spyOn(updatePaymentAndOrderService, 'updateOrder').mockRejectedValue(new Error('Order update failed'));

        await expect(service.consumerQueueCheckout(updateOrderDto)).rejects.toThrowError('Order update failed');

        expect(logErrorSpy).toHaveBeenCalledWith('Error parsing payment message: Invalid payment message format');
    });
});
