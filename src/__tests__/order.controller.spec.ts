import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../app/controllers/order.controller';
import { OrderService } from '../app/services/order.service';
import { CreateOrderDto } from '../app/dto/createOrder.dto';
import { Order } from '../app/entities/order.entity';

jest.mock('../app/services/order.service');
jest.mock('../app/services/auth.guard.service');

describe('OrderController', () => {
    let controller: OrderController;
    let service: OrderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [OrderService],
        }).compile();

        controller = module.get<OrderController>(OrderController);
        service = module.get<OrderService>(OrderService);
    });

    it('should create an order', async () => {
        // Explicitamente garantindo que clientId é do tipo número
        const createOrderDto: CreateOrderDto = {
            clientId: 123, // AQUI O CLIENTID É UM NÚMERO
            amount: 199,
            status: 'pending'
        };

        const expectedOrder: Order = { id: 1, ...createOrderDto };

        jest.spyOn(service, 'createOrder').mockResolvedValue(expectedOrder);

        // Verificando se a criação da ordem retorna o resultado esperado
        await expect(controller.createOrder(createOrderDto)).resolves.toEqual(expectedOrder);
    });
});
