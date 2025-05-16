import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletServiceClient } from 'libs/shared-lib/src';
import { BillingRecord } from './entities/billing.entity';
import { Repository } from 'typeorm';
import { BillingEventDto } from './events/billing.event';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillingRecord)
    private billingRepository: Repository<BillingRecord>,
    private walletService: WalletServiceClient,
  ) {}

  async processPaymentEvent(event: BillingEventDto) {
    console.log("Process Payment Event")
    console.log("Event:", event);
    console.log('Event Type:', event.type);

    if (event.type !== 'payment.completed') return;

    const { data } = event;
    console.log('Event Data:', data);

    const { paymentId, paidBy, paidTo, reference, paymentType } = data;

    console.log('Creating Billing Record');

    const amount = parseFloat(data.amount);
    const billingRecord = this.billingRepository.create({
      paymentId, 
      transactionnType: paymentType,
      fromUserId: paidBy,
      toUserId: paidTo,
      amount,
      reference,
    })

    await this.billingRepository.save(billingRecord);

    console.log('Created Billing Record:', billingRecord);

    if (paymentType === 'transfer') {
      console.log('Handling transfer case');
      if (!paidTo) {
        console.error('Recipient is null');
        return;
      }
      await this.processTransfer(paidBy, paidTo, amount, reference);
    } else {
      console.log("Handling deposit case");
      await this.processFunding(paidBy, amount, reference);
    }
  }

  private async processTransfer(from: string, to: string, amount: number, reference: string) {

    await this.walletService.debitWallet({
      userId: from,
      amount, reference: `DEBIT-${reference}`
    });

    await this.walletService.creditWallet({
      userId: to,
      amount,
      reference: `CREDIT-${reference}`
    });

    await this.billingRepository.update( { reference }, { status: 'completed'}, );
  }

  private async processFunding(userId: string, amount: number, reference: string) {
    await this.walletService.creditWallet({
      userId, 
      amount, 
      reference: `DEPOSIT-${reference}`
    });

    await this.billingRepository.update(
      { reference },
      { status: 'completed' }
    )
  }
}
