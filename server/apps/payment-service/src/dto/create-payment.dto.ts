import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePaymentDto {
    @IsOptional()
    paid_to?: string;

    @IsNumber()
    amount: number;
}