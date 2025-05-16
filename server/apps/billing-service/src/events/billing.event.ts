export class BillingEventDto {
    eventId: string;
    type: string;
    timestamp: Date;
    data: {
        paymentId: string;
        paidBy: string;
        paidTo?: string | null;
        amount: string;
        reference: string;
        paymentType: 'transfer' | 'deposit';
    }
}