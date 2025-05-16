import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "libs/shared-lib/src";
import { PaymentCompletedEvent } from "./payment.event";

@Injectable()
export class PaymentPublisher {
    constructor(private readonly rabbitMQService: RabbitMQService) {}

    async publishPaymentCompleted(event: PaymentCompletedEvent) {
        try {
            await this.rabbitMQService.publish('payment_exchange','payment.completed', {
                eventId: event.paymentId,
                type: 'payment.completed',
                timestamp: new Date().toISOString(),
                data: {
                    paymentId: event.paymentId,
                    paidBy: event.paidBy,
                    paidTo: event.paidTo,
                    amount: event.amount,
                    reference: event.reference,
                    paymentType: event.type
                }
            });
            console.log('Payment event published')
        } catch (error) {
            console.error('Failed to publish payment completed event:', error)
            throw error;
        }
    }
}