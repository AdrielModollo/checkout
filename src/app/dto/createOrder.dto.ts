import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({
        description: 'Customer ID',
        example: 123,
        required: true,
    })
    @IsNotEmpty({ message: 'Customer ID is required' })
    @IsNumber({}, { message: 'The customer ID must be a number.' })
    clientId: number;

    @ApiProperty({
        description: 'Order value',
        example: 199,
        required: true,
    })
    @IsNotEmpty({ message: 'The order value is mandatory.' })
    @IsNumber({}, { message: 'The order value must be a number.' })
    amount: number;

    @ApiProperty({
        description: 'Order status',
        example: 'pending',
        required: true,
    })
    @IsNotEmpty({ message: 'Order status is required.' })
    @IsString({ message: 'The order status must be a string.' })
    status: string;
}
