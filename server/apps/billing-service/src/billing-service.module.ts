import { Module } from '@nestjs/common';
import { BillingService } from './billing-service.service';
import { RabbitMQModule, ServiceAuthModule, WalletServiceClient } from 'libs/shared-lib/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingRecord } from './entities/billing.entity';
import { BillingConsumer } from './events/billing.consumer';
import { BillingDatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([BillingRecord]),
    RabbitMQModule,
    BillingDatabaseModule,
    HttpModule,
    JwtModule,
    ConfigModule,
    ServiceAuthModule,
  ],
  providers: [BillingService, BillingConsumer, WalletServiceClient],
})
export class BillingServiceModule {}
