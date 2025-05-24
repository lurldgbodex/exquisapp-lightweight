import { Module } from '@nestjs/common';
import { WalletService } from './wallet-service.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { UserConsumer } from './consumers/user.consumer';
import { WalletController } from './wallet-service.controller';
import { RabbitMQModule, ServiceAuthModule, ServiceJwtGuard } from 'libs/shared-lib/src';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), 'apps/user-service/.env')
    }),
    TypeOrmModule.forFeature([Wallet]),
    DatabaseModule,
    ServiceAuthModule,
    RabbitMQModule,
  ],
  providers: [WalletService, UserConsumer, ServiceJwtGuard],
  controllers: [WalletController],
})
export class WalletServiceModule {}
