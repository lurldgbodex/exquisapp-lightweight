import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { v4 as uuid4 } from 'uuid';
import { UserServiceClient, WalletServiceClient } from 'libs/shared-lib/src';
import { PaymentPublisher } from './events/payment.publisher';
import { PaymentCompletedEvent } from './events/payment.event';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly userServiceClient: UserServiceClient,
    private readonly walletServiceClient: WalletServiceClient,
    private readonly paymentPublisher: PaymentPublisher,
  ) {}

  async initiatePayment(createPaymentDto: CreatePaymentDto, userId: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    
    if (createPaymentDto.paid_to && createPaymentDto.paid_to === userId) {
      throw new BadRequestException('Cannot transfer to yourself')
    }

    if (createPaymentDto.paid_to) {
      const validation = await this.userServiceClient.validateUser(createPaymentDto.paid_to);
      if (!validation.isvalid) {
        throw new BadRequestException('Invalid recipient user');
      }
    }

    const paymentType = createPaymentDto.paid_to ? 'transfer' : 'deposit';
    if (paymentType === 'transfer') {
      const senderBalance = await this.walletServiceClient.getBalance(userId);
      const balance = parseFloat(senderBalance);
      

      if (balance < createPaymentDto.amount) {
        throw new BadRequestException(`User ${userId} has insufficient funds`)
      }
    }
    
    const payment = this.paymentRepository.create({
      paidBy: userId,
      paidTo: createPaymentDto.paid_to || null,
      amount: createPaymentDto.amount,
      type: paymentType,
      reference: `PAY-${uuid4()}`,
      status: 'pending',
    });

    await this.paymentRepository.save(payment);

    setTimeout(() => this.processPayment(payment.id), 2000);

    return {
      id: payment.id,
      status: payment.status,
      reference: payment.reference,
      type: payment.type,
    };
  }

  private async processPayment(paymentId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) return;

    payment.status = 'completed';
    await this.paymentRepository.save(payment);

    await this.paymentPublisher.publishPaymentCompleted(
      new PaymentCompletedEvent(
        payment.id,
        payment.paidBy,
        payment.paidTo,
        payment.amount,
        payment.reference,
        payment.type
      )
    )
  }

  async getPaymentStatus(reference: string) {
    return await this.paymentRepository.findOne({
      where: { reference },
      select: [ 'id', 'status', 'amount', 'reference' ],
    });
  }
}
