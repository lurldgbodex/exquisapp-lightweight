import { IsNotEmpty } from "class-validator";

export class PaymentStatusDto {
    @IsNotEmpty()
    reference: string;
}