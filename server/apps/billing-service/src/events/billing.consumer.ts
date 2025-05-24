import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { BillingService } from "../billing-service.service";
import { RabbitMQService } from "libs/shared-lib/src";

@Injectable()
export class BillingConsumer implements OnModuleInit {
    private readonly logger = new Logger(BillingConsumer.name);
    
    constructor(
        private readonly billingSerice: BillingService,
        private readonly rabbitMQService: RabbitMQService,
    ) {}

    async onModuleInit() {
        await this.setupConsumer();
    }

    async setupConsumer() {
        try {
            this.logger.debug('Creating channel')
            const channel = await this.rabbitMQService.createChannel();
            this.logger.debug('Channel created')

            await channel.addSetup(async (channel) => {
                const queue = await channel.assertQueue('billing_service_queue', { 
                    durable: true, 
                    arguments: {
                        'x-dead-letter-exchange': 'dead_letters',
                        'x-message-ttl': 86400000
                    }
                })

                await Promise.all([
                    channel.bindQueue(queue.queue, 'payment_exchange', 'payment.completed'),
                    channel.prefetch(1),
                ]);

                await channel.consume(queue.queue, async (message) => {
                    if (message) {
                        try {
                            const content = JSON.parse(message.content.toString());

                            this.logger.debug(`Message Received and Calling Billing Service`);
                            await this.billingSerice.processPaymentEvent(content);

                            channel.ack(message);
                        } catch (error) {
                            this.logger.error('Error processing message:', error);
                            channel.nack(message, false, false);
                        }
                    }
                });

                channel.on('error', (err) => {
                    console.error('Channel error:', err);
                });

                channel.on('close', () => {
                    console.log('channel closed');
                })
            });
        } catch (error) {
            console.error("Failed to setup billing consumer:", error)
        }
    }
}