import { IsDecimal, IsNotEmpty, IsNumber, Min } from "class-validator";

export class WalletDto {
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @Min(0.01)
    amount: number;

    reference: string;
}