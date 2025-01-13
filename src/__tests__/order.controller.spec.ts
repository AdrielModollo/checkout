import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../app/controllers/order.controller';
import { CheckoutService } from '../app/services/checkout.service';
import { CreateOrderDto } from '../app/dto/createOrder.dto';
import { Order } from '../app/entities/order.entity';

jest.mock('../app/services/checkout.service');
jest.mock('../app/services/auth.guard.service');

describe('OrderController', () => {
    let controller: OrderController;
    let service: CheckoutService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [CheckoutService],
        }).compile();

        controller = module.get<OrderController>(OrderController);
        service = module.get<CheckoutService>(CheckoutService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create an order', async () => {
        const createOrderDto: CreateOrderDto = {
            clientId: 123,
            amount: 199,
            status: 'pending',
        };

        const expectedOrder: Order = { id: 1, ...createOrderDto };

        jest.spyOn(service, 'checkoutOrder').mockResolvedValue(expectedOrder);

        await expect(controller.createOrder(createOrderDto)).resolves.toEqual(expectedOrder);
    });
});
