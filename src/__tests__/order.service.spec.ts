import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../app/services/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../app/entities/order.entity';
import { RmqService } from '../app/config/rabbitMq/rabbitMq.service';
import { Repository } from 'typeorm';
import { logger } from '../app/communs/logger.winston';

// Mockando as dependências
jest.mock('../app/config/rabbitMq/rabbitMq.service');
jest.mock('../app/communs/logger.winston');

describe('OrderService', () => {
    let orderService: OrderService;
    let orderRepository: Repository<Order>;
    let rmqService: RmqService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: getRepositoryToken(Order),
                    useClass: Repository,
                },
                RmqService,
            ],
        }).compile();

        orderService = module.get<OrderService>(OrderService);
        orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
        rmqService = module.get<RmqService>(RmqService);
    });

    it('should create an order', async () => {
        const createOrderDto = { clientId: 123, amount: 100, status: 'PENDING' };

        const savedOrder = { id: 1, ...createOrderDto };

        jest.spyOn(orderRepository, 'save').mockResolvedValue(savedOrder as Order);
        const logInfoSpy = jest.spyOn(logger, 'info');

        const result = await orderService.createOrder(createOrderDto);

        expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining(createOrderDto));
        expect(logInfoSpy).toHaveBeenCalledWith(`Order created successfully: ${JSON.stringify(savedOrder)}`);
        expect(result).toEqual(savedOrder);
    });




    it('should log an error if order creation fails', async () => {
        const createOrderDto = { clientId: '123', amount: 100, status: 'PENDING' };

        jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error('Database error'));
        const logErrorSpy = jest.spyOn(logger, 'error');

        await orderService.createOrder(createOrderDto);

        expect(logErrorSpy).toHaveBeenCalledWith('Error creating order: Database error');
    });
});
