import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreatePaymentDto {
    @IsOptional()
    paid_to?: string;

    @IsNotEmpty()
    paid_by: string;

    @IsNumber()
    amount: number;
}