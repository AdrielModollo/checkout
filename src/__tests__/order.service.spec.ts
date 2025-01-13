import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../app/services/order.service'; // Atualizando o caminho
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../app/entities/order.entity'; // Atualizando o caminho
import { UpdateOrderDto } from '../app/dto/updateOrder.dto'; // Atualizando o caminho
import { logger } from '../app/communs/logger.winston'; // Atualizando o caminho

jest.mock('../app/communs/logger.winston'); // Mock do logger

describe('OrderService', () => {
    let service: OrderService;
    let orderRepository: jest.Mocked<Repository<Order>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: getRepositoryToken(Order),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        orderRepository = module.get(getRepositoryToken(Order));
    });

    it('should update an order successfully', async () => {
        const updateOrderDto: UpdateOrderDto = { orderId: 1, status: 'COMPLETED' };
        const existingOrder = { id: 1, status: 'PENDING', amount: 100, clientId: 123 } as Order;
        const updatedOrder = { ...existingOrder, status: 'COMPLETED' } as Order;

        orderRepository.findOne.mockResolvedValue(existingOrder);
        orderRepository.save.mockResolvedValue(updatedOrder);
        const logInfoSpy = jest.spyOn(logger, 'info');

        const result = await service.updateOrder(updateOrderDto);

        expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: updateOrderDto.orderId } });
        expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'COMPLETED' }));
        expect(logInfoSpy).toHaveBeenCalledWith(`Order updated successfully: ${JSON.stringify(updatedOrder)}`);
        expect(result).toEqual(updatedOrder);
    });

    it('should log an error if the order does not exist', async () => {
        const updateOrderDto: UpdateOrderDto = { orderId: 99, status: 'COMPLETED' };

        orderRepository.findOne.mockResolvedValue(null);
        const logErrorSpy = jest.spyOn(logger, 'error');

        await expect(service.updateOrder(updateOrderDto)).rejects.toThrowError('Order not found');

        expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: updateOrderDto.orderId } });
        expect(orderRepository.save).not.toHaveBeenCalled();
        expect(logErrorSpy).toHaveBeenCalledWith('Error updating order: Order not found');
    });

    it('should log an error if updating the order fails', async () => {
        const updateOrderDto: UpdateOrderDto = { orderId: 1, status: 'COMPLETED' };
        const existingOrder = { id: 1, status: 'PENDING', amount: 100, clientId: 123 } as Order;

        orderRepository.findOne.mockResolvedValue(existingOrder);
        orderRepository.save.mockRejectedValue(new Error('Database error'));
        const logErrorSpy = jest.spyOn(logger, 'error');

        await expect(service.updateOrder(updateOrderDto)).rejects.toThrowError('Database error');

        expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: updateOrderDto.orderId } });
        expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'COMPLETED' }));
        expect(logErrorSpy).toHaveBeenCalledWith('Error updating order: Database error');
    });
});
