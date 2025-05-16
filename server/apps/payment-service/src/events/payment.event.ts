export class PaymentCompletedEvent {
   constructor(
      public readonly paymentId: string,
      public readonly paidBy: string,
      public readonly paidTo: string | null,
      public readonly amount: number,
      public readonly reference: string,
      public readonly type: 'transfer' | 'deposit',
      public readonly timestamp: Date = new Date()
    ) {}
}