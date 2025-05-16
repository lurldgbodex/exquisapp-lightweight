import { Injectable, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqp-connection-manager';
import { BillingService } from "../billing-service.service";

@Injectable()
export class BillingConsumer implements OnModuleInit {
    private connection: amqp.AmqpConnectionManager;
    private channelWrapper: amqp.ChannelWrapper;

    constructor(private readonly billingSerice: BillingService) {}

    async onModuleInit() {
        await this.setupConsumer();
    }

    private async setupConsumer() {
        this.connection = amqp.connect(['amqp://localhost:5672'], {
            reconnectTimeInSeconds: 5
        });
        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: (channel) => {
                return Promise.all([
                    channel.assertExchange('payment_exchange', 'topic', { durable: true }),
                    channel.assertQueue('billing_service_queue', { durable: true }),
                    channel.bindQueue('billing_service_queue', 'payment_exchange', 'payment.completed'),
                    channel.prefetch(1),
                ]);
            }
        });

        this.channelWrapper.consume('billing_service_queue', async (message) => {
            console.log('Received message with routing key:', message.fields.routingKey);
            console.log('Exchange:', message.fields.exchange);

            if (message) {
                try {
                    const content = JSON.parse(message.content.toString());

                    console.log(`Received message: ${JSON.stringify(content)}`);
                    console.log('Billing Service called')
                    await this.billingSerice.processPaymentEvent(content);
                    this.channelWrapper.ack(message);
                } catch (error) {
                    console.error('Error processing message:', error);
                    this.channelWrapper.nack(message, false, false);
                }
            }
        });
    }
}