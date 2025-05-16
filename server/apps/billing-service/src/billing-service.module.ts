import { Module } from '@nestjs/common';
import { BillingService } from './billing-service.service';
import { RabbitMQModule, WalletServiceClient } from 'libs/shared-lib/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingRecord } from './entities/billing.entity';
import { BillingConsumer } from './events/billing.consumer';
import { BillingDatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingRecord]),
    RabbitMQModule,
    BillingDatabaseModule,
    HttpModule,
  ],
  providers: [BillingService, BillingConsumer, WalletServiceClient],
})
export class BillingServiceModule {}
