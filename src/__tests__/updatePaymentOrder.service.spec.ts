import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePaymentOrderService } from '../app/services/updatePaymentOrder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../app/entities/order.entity';
import { UpdateOrderDto } from '../app/dto/updateOrder.dto';
import { logger } from '../app/communs/logger.winston';

// Mockando as dependências
jest.mock('../app/communs/logger.winston');

describe('UpdatePaymentOrderService', () => {
    let service: UpdatePaymentOrderService;
    let orderRepository: Repository<Order>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdatePaymentOrderService,
                {
                    provide: getRepositoryToken(Order),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UpdatePaymentOrderService>(UpdatePaymentOrderService);
        orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    });

    it('should update an order successfully', async () => {
        const updateOrderDto: UpdateOrderDto = { orderId: 1, status: 'COMPLETED' };
        const existingOrder = { id: 1, status: 'PENDING', amount: 100, clientId: 123 } as Order;
        const updatedOrder = { ...existingOrder, status: 'COMPLETED' } as Order;

        jest.spyOn(orderRepository, 'findOne').mockResolvedValue(existingOrder);
        jest.spyOn(orderRepository, 'save').mockResolvedValue(updatedOrder);
        const logInfoSpy = jest.spyOn(logger, 'info');

        const result = await service.updateOrder(updateOrderDto);

        expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: updateOrderDto.orderId } });
        expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'COMPLETED' }));
        expect(logInfoSpy).toHaveBeenCalledWith(`Order updated successfully: ${JSON.stringify(updatedOrder)}`);
        expect(result).toEqual(updatedOrder);
    });

    it('should log an error if updating the order fails', async () => {
        const updateOrderDto: UpdateOrderDto = { orderId: 1, status: 'COMPLETED' };
        const existingOrder = { id: 1, status: 'PENDING', amount: 100, clientId: 123 } as Order;

        jest.spyOn(orderRepository, 'findOne').mockResolvedValue(existingOrder);
        jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error('Database error'));
        const logErrorSpy = jest.spyOn(logger, 'error');

        await expect(service.updateOrder(updateOrderDto)).rejects.toThrowError('Database error');

        expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: updateOrderDto.orderId } });
        expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: 'COMPLETED' }));
        expect(logErrorSpy).toHaveBeenCalledWith('Error updating order: Database error');
    });
});
