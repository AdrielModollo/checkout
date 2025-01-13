import { Test, TestingModule } from '@nestjs/testing';
import { SendQueueService } from '../app/services/sendQueue.service';
import { RmqService } from '../app/config/rabbitMq/rabbitMq.service';

// Mocking the dependencies
jest.mock('../app/config/rabbitMq/rabbitMq.service');

describe('SendQueueService', () => {
    let service: SendQueueService;
    let rmqService: RmqService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SendQueueService,
                {
                    provide: RmqService,
                    useValue: {
                        sendOrder: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<SendQueueService>(SendQueueService);
        rmqService = module.get<RmqService>(RmqService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendOrder', () => {
        it('should call rmqService.sendOrder with correct parameters', async () => {
            const orderId = 1;
            const amount = 100;
            const status = 'PAID';

            await service.sendOrder(orderId, amount, status);

            expect(rmqService.sendOrder).toHaveBeenCalledWith('checkout', orderId, amount, status);
        });

        it('should log an error if sending the order fails', async () => {
            const orderId = 1;
            const amount = 100;
            const status = 'PAID';

            // Simulating an error on sendOrder method
            rmqService.sendOrder = jest.fn().mockRejectedValue(new Error('Error sending order'));

            await expect(service.sendOrder(orderId, amount, status)).rejects.toThrow('Error sending order');
        });
    });
});
