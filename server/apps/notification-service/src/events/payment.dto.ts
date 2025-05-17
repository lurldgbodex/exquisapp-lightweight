export class PaymentDto {
    eventId: string;
    type: string;
    data: {
        paymentId: string;
        paidBy: string;
        paidTo?: string | null;
        amount: string;
        reference: string;
        paymentType: string;
    }
}