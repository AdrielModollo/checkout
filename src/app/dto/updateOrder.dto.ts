import { IsInt, IsString } from "class-validator";

export class UpdateOrderDto {
    @IsInt()
    orderId: number;

    @IsString()
    status: string;
}
