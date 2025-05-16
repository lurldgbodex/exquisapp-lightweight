import { Module } from '@nestjs/common';
import { WalletService } from './wallet-service.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { UserConsumer } from './consumers/user.consumer';
import { WalletController } from './wallet-service.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Wallet]),
    DatabaseModule,
  ],
  providers: [WalletService, UserConsumer],
  controllers: [WalletController],
})
export class WalletServiceModule {}
