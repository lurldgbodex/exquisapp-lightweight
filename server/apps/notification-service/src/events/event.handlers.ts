import { Injectable } from "@nestjs/common";
import { RabbitMQService, UserServiceClient } from "libs/shared-lib/src";
import { EmailService } from "../emails/email.service";
import { UserCreatedDto } from "./user-created.dto";
import { PaymentDto } from "./payment.dto";
import { WalletDto } from "./wallet.dto";

@Injectable()
export class EventHandlers {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly emailService: EmailService,
        private readonly userServiceClient: UserServiceClient,
    ) {}

    async initializeEventListeners() {
        try {
            const channel = await this.rabbitMQService.createChannel();

            await channel.addSetup(async (channel) => {
                const queue = await channel.assertQueue('notificaton_queue', { 
                    durable: true, 
                    arguments: {
                        'x-dead-letter-exchange': 'dead_letters',
                        'x-message-ttl': 86400000
                    }
                })

                await Promise.all([
                    channel.bindQueue(queue.queue, 'user_events', 'user.registered'),
                    channel.bindQueue(queue.queue, 'payment_exchange', 'payment.completed'),
                    channel.bindQueue(queue.queue, 'wallet_events', 'wallet.credited'),
                    channel.bindQueue(queue.queue, 'wallet_events', 'wallet.debited'),
                ]);

                await channel.consume(queue.queue, async (msg) => {
                    if (msg !== null) {
                        try {
                            const content = JSON.parse(msg.content.toString());
                            const routingKey = msg.fields.routingKey;
        
                            await this.handleEvent(routingKey, content);
                            channel.ack(msg);
                        } catch (error) {
                            console.error('Error processing message:', error);
                            channel.nack(msg, false, false);
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
            console.error("Failed to initialize event listeners:", error)
        }
    }

    private async handleEvent(routingKey: string, content: any) {
      console.log("Routing Key:", routingKey)
      console.log('Event Message:', content)

        switch (routingKey) {
            case 'user.registered':
                await this.handleUserCreated(content);
                break;
            case 'payment.completed':
                await this.handlePaymentCompleted(content);
                break;
            case 'wallet.credited':
                await this.handleWalletCredited(content);
                break;
            case 'wallet.debited':
                await this.handleWalletDebited(content);
            default:
                console.warn('Unhandled event type:', routingKey)
        }
    }

    private async handleUserCreated(event: UserCreatedDto) {
        const subject = 'Welcome to Our MoneyPal!';
        const html = `
          <h1>Welcome, ${event.name}!</h1>
          <p>Your account has been successfully created.</p>
          <p>A wallet has been automatically created for you with a starting balance of 0.</p>
        `;
        
        await this.emailService.sendEmail(event.email, subject, html);
      }
    
      private async handlePaymentCompleted(event: PaymentDto) {
        const subject = 'Payment Initiated';
        const html = `
          <h1>Payment Confirmation</h1>
          <p>A transaction of ${event.data.amount}, has been initiated by you</p>
          <p>Reference: ${event.data.reference}</p>
        `;

        const user = await this.userServiceClient.validateUser(event.data.paidBy);
        if (user.isvalid) {
          await this.emailService.sendEmail(user.userInfo!.email, subject, html);
        }
      }
    
      private async handleWalletCredited(event: WalletDto) {
        const subject = 'Wallet Credited';
        const html = `
          <h1>Wallet Update</h1>
          <p>Your wallet has been credited with $${event.amount}.</p>
          <p>Reference: ${event.reference}</p>
        `;
        
        const user = await this.userServiceClient.validateUser(event.userId);
        if (user.isvalid) {
          await this.emailService.sendEmail(user.userInfo!.email, subject, html);
        }
      }

      private async handleWalletDebited(event: WalletDto) {
        const subject = 'Wallet Debited';
        const html = `
          <h1>Wallet Update</h1>
          <p>Your wallet has been debited with $${event.amount}.</p>
          <p>Reference: ${event.reference}</p>
        `;
        
        const user = await this.userServiceClient.validateUser(event.userId);
        if (user.isvalid) {
          await this.emailService.sendEmail(user.userInfo!.email, subject, html);
        }
      }
}