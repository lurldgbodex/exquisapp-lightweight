import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection: amqp.AmqpConnectionManager;
    private channelWrapper: amqp.ChannelWrapper;
    private isConnected = false;
    private readonly connectionPromise: Promise<void>;

    constructor() {
        this.connectionPromise = this.initialize()
    }

   async onModuleInit() {
    await this.connectionPromise;      
   }

   async publish(exchange: string, routingKey: string, message: any) {
    if (!this.isConnected) {
        throw new Error('RabbitMQ not connected')
    }
    return this.channelWrapper.publish(exchange, routingKey, message);
   }

   async onModuleDestroy() {
       await this.channelWrapper.close();
       await this.connection.close();
   }

   async createChannel(): Promise<amqp.ChannelWrapper> {
    this.connection = amqp.connect(['amqp://localhost:5672'], {
        reconnectTimeInSeconds: 5
    });

    return this.connection.createChannel({
        json: true,
        setup: (channel) => {
            return Promise.all([
                channel.assertExchange('user_events', 'topic', { durable: true }),
                channel.assertExchange('payment_exchange', 'topic', { durable: true }),
                channel.assertExchange('wallet_events', 'topic', { durable: true}),
            ])
        }
    })
   }

   private async initialize(): Promise<void> {
    try {
        this.channelWrapper = await this.createChannel();

        this.connection.on('connect', () => {
            console.log("RabbitMQ connected");
            this.isConnected = true;
        });

        this.connection.on('disconnect', (err) => {
            console.log('RabbitMQ disconnected', err);
            this.isConnected = false;
        });

        await this.channelWrapper.waitForConnect();
    } catch (err) {
        console.error('RabbitMQ initialization failed:', err);
        throw err;
    }
   }
}