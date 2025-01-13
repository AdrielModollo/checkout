import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from '../app/services/checkout.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../app/entities/order.entity';
import { SendQueueService } from '../app/services/sendQueue.service';
import { ConsumerQueueService } from '../app/services/consumerQueue.service';
import { CreateOrderDto } from '../app/dto/createOrder.dto';

jest.mock('../app/services/sendQueue.service');
jest.mock('../app/services/consumerQueue.service');

describe('CheckoutService', () => {
    let service: CheckoutService;
    let orderRepository: Repository<Order>;
    let sendQueueService: SendQueueService;
    let consumerQueueService: ConsumerQueueService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CheckoutService,
                {
                    provide: getRepositoryToken(Order),
                    useClass: Repository,  // Mock do repositório do Order
                },
                SendQueueService,
                ConsumerQueueService,
            ],
        }).compile();

        service = module.get<CheckoutService>(CheckoutService);
        orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
        sendQueueService = module.get<SendQueueService>(SendQueueService);
        consumerQueueService = module.get<ConsumerQueueService>(ConsumerQueueService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create and return an order', async () => {
        const createOrderDto: CreateOrderDto = {
            clientId: 123,
            amount: 199,
            status: 'pending',
        };

        const expectedOrder: Order = {
            id: 1,
            ...createOrderDto,
        };

        // Mock do repositório para simular o comportamento do save()
        jest.spyOn(orderRepository, 'save').mockResolvedValue(expectedOrder);

        // Mock para os outros serviços
        jest.spyOn(sendQueueService, 'sendOrder').mockResolvedValue(undefined);
        jest.spyOn(consumerQueueService, 'consumerQueuePayment').mockResolvedValue(undefined);

        // Chama o método checkoutOrder
        const result = await service.checkoutOrder(createOrderDto);

        // Verifica se o resultado é o esperado
        expect(result).toEqual(expectedOrder);

        // Verifica se os métodos dos outros serviços foram chamados corretamente
        expect(sendQueueService.sendOrder).toHaveBeenCalledWith(expectedOrder.id, expectedOrder.amount, expectedOrder.status);
        expect(consumerQueueService.consumerQueuePayment).toHaveBeenCalledWith('payment');
    });

    it('should throw an error if order creation fails', async () => {
        const createOrderDto: CreateOrderDto = {
            clientId: 123,
            amount: 199,
            status: 'pending',
        };

        // Simula erro na criação do pedido (exemplo de erro no repositório)
        jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error('Database error'));

        // Verifica se a exceção é lançada corretamente
        await expect(service.checkoutOrder(createOrderDto)).rejects.toThrow('Database error');
    });
});
