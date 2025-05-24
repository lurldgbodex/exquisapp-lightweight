import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RabbitMQService, WalletServiceClient } from 'libs/shared-lib/src';
import { BillingRecord } from './entities/billing.entity';
import { Repository } from 'typeorm';
import { BillingEventDto } from './events/billing.event';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectRepository(BillingRecord)
    private billingRepository: Repository<BillingRecord>,
    private walletService: WalletServiceClient,
    private rabbitMQService: RabbitMQService,
  ) {}

  async getUserBillingRecords(userId: string): Promise<{deposits: BillingRecord[], transfers: BillingRecord[]}> {
    const [deposits, transfers] = await Promise.all([
      this.getUserDeposits(userId),
      this.getUserTransfers(userId),
    ]);

    return { deposits, transfers };
  }
  async getUserDeposits(userId: string): Promise<BillingRecord[]> {
    return await this.billingRepository.find({
      where: {
        fromUserId: userId,
        transactionType: 'deposit',
      },
      order: {
        createdAt: 'DESC',
      },
    })
  }

  async getUserTransfers(userId: string): Promise<BillingRecord[]> {
    return await this.billingRepository.find({
      where: {
        fromUserId: userId,
        transactionType: 'transfer',
      },
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async processPaymentEvent(event: BillingEventDto) {
    this.logger.debug("Processing Payment Event")

    if (event.type !== 'payment.completed') return;

    const { data } = event;
    const { paymentId, paidBy, paidTo, reference, paymentType } = data;

   this.logger.debug('Creating Billing Record');

    const amount = parseFloat(data.amount);
    const billingRecord = this.billingRepository.create({
      paymentId, 
      transactionType: paymentType,
      fromUserId: paidBy,
      toUserId: paidTo,
      amount,
      reference,
    })

    await this.billingRepository.save(billingRecord);

    this.logger.log('Created Billing Record:', billingRecord);

    if (paymentType === 'transfer') {
      this.logger.debug('Handling transfer case');

      if (!paidTo) {
        this.logger.error('Recipient is null');
        return;
      }

      await this.processTransfer(paidBy, paidTo, amount, reference);
    } else {
      this.logger.debug("Handling deposit case");
      await this.processFunding(paidBy, amount, reference);
    }
  }

  private async processTransfer(from: string, to: string, amount: number, reference: string) {
    const transactionInfo = {
      userId: from,
      amount,
      reference: `DEBIT-${reference}`
    }

    await this.walletService.debitWallet({
      userId: from,
      amount, reference: transactionInfo.reference,
    });

    this.publishWalletDebitedEvent(transactionInfo).catch(err => {
      this.logger.error('Failed to publish wallet debited event:', err);
    })

    const creditReference = `CREDIT-${reference}`
    await this.walletService.creditWallet({
      userId: to,
      amount,
      reference: creditReference
    });

    await this.billingRepository.update( { reference }, { status: 'completed'}, );

    this.publishWalletCreditedEvent(to, amount, creditReference).catch(err => {
      this.logger.error('Failed to publish credit wallet event:', err);
    })
  }

  private async processFunding(userId: string, amount: number, reference: string) {
    const creditReference = `DEPOSIT-${reference}`

    await this.walletService.creditWallet({
      userId, 
      amount, 
      reference: creditReference
    });

    await this.billingRepository.update(
      { reference },
      { status: 'completed' }
    )

    this.publishWalletCreditedEvent(userId, amount, creditReference);
  }

   private async publishWalletCreditedEvent(userId: string, amount: number, reference: string) {
        this.logger.debug('Publishing wallet credited event');

        await this.rabbitMQService.publish('wallet_events', 'wallet.credited', {
            eventType: 'WALLET_CREDITED',
            userId,
            amount,
            reference,
        });

        this.logger.debug('User Registered Event Published');
    }

     private async publishWalletDebitedEvent(transactionInfo: { userId: string, amount: number, reference: string }) {
          this.logger.debug('Publishing wallet Debited event');
  
          await this.rabbitMQService.publish('wallet_events', 'wallet.debited', {
              eventType: 'WALLET_DEBITED',
              userId: transactionInfo.userId,
              amount: transactionInfo.amount,
              reference: transactionInfo.reference,
          });
  
          this.logger.debug('User Registered Event Published');
      }
}
