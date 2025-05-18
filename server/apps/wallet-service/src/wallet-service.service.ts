import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { WalletDto } from './dto/wallet.dto';
import { Decimal } from 'decimal.js';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWallet(userId: string): Promise<Wallet> {
    console.log('Event received to create wallet')
    const wallet = await this.walletRepository.create({ userId });
    return await this.walletRepository.save(wallet);
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { userId }});
    if (!wallet) {
      throw new NotFoundException('wallet not found for id')
    }

    return wallet;
  }

  async getWalletBalance(userId: string): Promise<{balance: number}> {
    const wallet = await this.getWallet(userId);
    return {
      balance: wallet.balance
    }
  }

  async debitWallet(data: WalletDto) {
    const wallet = await this.getWallet(data.userId);
    if (wallet.balance < data.amount) {
      throw new BadRequestException('Insufficient funds for debit')
    }

    const currentBalance = new Decimal(wallet.balance);
    const amount = new Decimal(data.amount);
    wallet.balance = currentBalance.minus(amount).toNumber();

    await this.walletRepository.save(wallet);

    return wallet;
  }

  async creditWallet(data: WalletDto) {
    const wallet = await this.getWallet(data.userId);

    const currentBalance = new Decimal(wallet.balance);
    const amount = new Decimal(data.amount);
    wallet.balance = currentBalance.plus(amount).toNumber();

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
