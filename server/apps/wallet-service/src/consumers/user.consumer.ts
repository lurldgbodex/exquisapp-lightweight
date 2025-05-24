import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfirmChannel, Message } from 'amqplib';
import { WalletService } from "../wallet-service.service";
import { RabbitMQService } from "libs/shared-lib/src";

@Injectable()
export class UserConsumer implements OnModuleInit {
    private readonly logger = new Logger(UserConsumer.name);
    
    constructor(
        private readonly walletService: WalletService,
        private readonly rabbitMQService: RabbitMQService,
    ) {}

    async onModuleInit() {
        await this.setupConsumer();
    }

    async setupConsumer() {
        try {
            this.logger.debug('Creating channel for Wallet consumer')
            const channel = await this.rabbitMQService.createChannel();

            await channel.addSetup(async (channel) => {
                const queue = await channel.assertQueue('wallet_service_queue', { 
                    durable: true, 
                    arguments: {
                        'x-dead-letter-exchange': 'dead_letters',
                        'x-message-ttl': 86400000
                    }
                })

                await Promise.all([
                    channel.bindQueue(queue.queue, 'user_events', 'user.registered'),
                    channel.prefetch(1),
                ]);

                await channel.consume(queue.queue, async (msg) => {
                    if (msg) {
                        try {        
                            const content = JSON.parse(msg.content.toString());
                            this.logger.debug(`User Registered event received and handling wallet creation`);

                            if (content.eventType === 'USER_REGISTERED') {
                                await this.walletService.createWallet(content.userId);
                                this.logger.debug(`Wallet created for user ${content.userId}`);
                                
                                channel.ack(msg);
                            } else {
                                this.logger.warn('Unkown event type:', content.eventType);
                                channel.nack(msg, false, false);
                            }
                        } catch (error) {
                            this.logger.error('Error processing message:', error);
                            channel.nack(msg, false, false);
                        }
                    }
                });

                channel.on('error', (err) => {
                    this.logger.error('Channel error:', err);
                });

                channel.on('close', () => {
                this.logger.log('channel closed');
                })
            });
        } catch (error) {
            this.logger.error("Failed to setup wallet consumer:", error)
        }
    }
}