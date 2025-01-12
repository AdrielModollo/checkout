import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDto {
    @IsNotEmpty({ message: 'Order ID is required' })
    @IsNumber({}, { message: 'Order ID must be a number' })
    orderId: number;

    @IsNotEmpty({ message: 'Payment status is required' })
    @IsString({ message: 'Payment status must be a string' })
    status: string;
}
