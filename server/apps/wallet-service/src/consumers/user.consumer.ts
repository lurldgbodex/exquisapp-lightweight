import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqp-connection-manager';
import { ConfirmChannel, Message } from 'amqplib';
import { WalletService } from "../wallet-service.service";

@Injectable()
export class UserConsumer implements OnModuleInit {
    private connection: amqp.AmqpConnectionManager;
    private channelWrapper: amqp.ChannelWrapper;
    private readonly logger = new Logger(UserConsumer.name);

    constructor(private readonly walletService: WalletService) {}
   
    async onModuleInit() {
        this.logger.log('Initializing RabbitMQ connection');

        this.connection = amqp.connect(['amqp://localhost:5672'], {
            reconnectTimeInSeconds: 5,
            heartbeatIntervalInSeconds: 60
        });

        this.connection.on('connect', () => {
            this.logger.log('Successfully connected to RabbitMQ');
        });

        this.connection.on('disconnect', (err) => {
            this.logger.error('RabbitMQ connection lost', err);
        });
    
        this.channelWrapper = this.connection.createChannel({
            json: true,
            setup: (channel) => {
                return Promise.all([
                    channel.assertExchange('user_events', 'topic', {durable: true}),
                    channel.assertQueue('wallet_service_queue', { durable: true }),
                    channel.bindQueue('wallet_service_queue', 'user_events', 'user.registered'),
                    channel.prefetch(1),
                    channel.consume('wallet_service_queue', (msg) => this.handleMessage(msg, channel))
                ]).then(() => {
                    this.logger.log('Channel setup completed');
                });
            },
        });

        this.channelWrapper.on('connect', () => {
            this.logger.log('Channel connected');
        });

        this.channelWrapper.on('error', (err) => {
            this.logger.error('Channel error:', err);
        });

        this.channelWrapper.on('close', () => {
            this.logger.warn('Channel closed');
        })
    }

    private async handleMessage(msg: Message | null, channel: ConfirmChannel) {
        if (!msg) {
            this.logger.warn('Received null message')
            return;
        }

        this.logger.debug('Received message with routing key:', msg.fields.routingKey);
        this.logger.debug('Exchange:', msg.fields.exchange);

        try {
            const content = JSON.parse(msg.content.toString());
            this.logger.log(`Received message: ${JSON.stringify(content)}`);

            if (content.eventType === 'USER_REGISTERED') {
                await this.walletService.createWallet(content.userId);
                this.logger.log(`Wallet created for user ${content.userId}`);
                channel.ack(msg);
            } else {
                this.logger.warn('Unkown event type:', content.eventType);
                channel.nack(msg, false, false);
            }
        } catch(error) {
            this.logger.error('Error proccesing messsage:', error);
            channel.nack(msg, false, true);
        }
    }
}