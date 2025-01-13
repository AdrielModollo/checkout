import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerQueueService } from '../app/services/consumerQueue.service';
import { PaymentService } from '../app/services/payment.service';
import { OrderService } from '../app/services/order.service';
import { RmqService } from '../app/config/rabbitMq/rabbitMq.service';
import { logger } from '../app/communs/logger.winston';

// Mocking the dependencies
jest.mock('../app/config/rabbitMq/rabbitMq.service');
jest.mock('../app/services/payment.service');
jest.mock('../app/services/order.service');
jest.mock('../app/communs/logger.winston');

describe('ConsumerQueueService', () => {
    let service: ConsumerQueueService;
    let paymentService: PaymentService;
    let orderService: OrderService;
    let rmqService: RmqService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConsumerQueueService,
                {
                    provide: PaymentService,
                    useValue: {
                        createPayment: jest.fn(),
                    },
                },
                {
                    provide: OrderService,
                    useValue: {
                        updateOrder: jest.fn(),
                    },
                },
                {
                    provide: RmqService,
                    useValue: {
                        consumePaymentQueue: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ConsumerQueueService>(ConsumerQueueService);
        paymentService = module.get<PaymentService>(PaymentService);
        orderService = module.get<OrderService>(OrderService);
        rmqService = module.get<RmqService>(RmqService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('consumerQueuePayment', () => {
        it('should call rmqService.consumePaymentQueue', async () => {
            const queueName = 'testQueue';
            rmqService.consumePaymentQueue = jest.fn().mockImplementationOnce((queue, callback) => {
                callback('{"orderId": 1, "status": "PAID"}');
            });

            await service.consumerQueuePayment(queueName);

            expect(rmqService.consumePaymentQueue).toHaveBeenCalledWith(queueName, expect.any(Function));
        });

        it('should call consumerQueueCheckout if the message is valid', async () => {
            const queueName = 'testQueue';
            const mockCallback = jest.fn();
            const createPaymentDto = { orderId: 1, status: 'PAID' };

            rmqService.consumePaymentQueue = jest.fn().mockImplementationOnce((queue, callback) => {
                callback(JSON.stringify(createPaymentDto));
            });

            service.consumerQueueCheckout = jest.fn();
            await service.consumerQueuePayment(queueName);

            expect(service.consumerQueueCheckout).toHaveBeenCalledWith(createPaymentDto);
        });

        it('should log an error if parsing the payment message fails', async () => {
            const queueName = 'testQueue';
            const invalidMessage = '{"invalidField": "value"}';

            rmqService.consumePaymentQueue = jest.fn().mockImplementationOnce((queue, callback) => {
                callback(invalidMessage);
            });

            await service.consumerQueuePayment(queueName);

            expect(logger.error).toHaveBeenCalledWith('Error processing payment message: Invalid payment message format');
        });
    });

    describe('consumerQueueCheckout', () => {
        it('should call paymentService.createPayment and orderService.updateOrder', async () => {
            const createPaymentDto = { orderId: 1, status: 'PAID' };

            await service.consumerQueueCheckout(createPaymentDto);

            expect(paymentService.createPayment).toHaveBeenCalledWith(createPaymentDto);
            expect(orderService.updateOrder).toHaveBeenCalledWith(createPaymentDto);
        });
    });

    describe('parsePaymentMessage', () => {
        it('should return parsed message if valid', async () => {
            const validMessage = '{"orderId": 1, "status": "PAID"}';
            const result = await service['parsePaymentMessage'](validMessage);

            expect(result).toEqual({ orderId: 1, status: 'PAID' });
        });

        it('should throw an error if message is invalid', async () => {
            const invalidMessage = '{"invalidField": "value"}';

            await expect(service['parsePaymentMessage'](invalidMessage)).rejects.toThrow('Invalid payment message format');
            expect(logger.error).toHaveBeenCalledWith('Error parsing payment message: Invalid payment message format');
        });
    });
});
