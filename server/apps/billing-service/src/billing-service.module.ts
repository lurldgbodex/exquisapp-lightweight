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
import { BillingController } from './billing-service.controller';
import { resolve} from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), 'apps/billing-service/.env')
    }),
    TypeOrmModule.forFeature([BillingRecord]),
    RabbitMQModule,
    BillingDatabaseModule,
    HttpModule,
    JwtModule,
    ConfigModule,
    ServiceAuthModule,
  ],
  providers: [BillingService, BillingConsumer, WalletServiceClient],
  controllers: [BillingController]
})
export class BillingServiceModule {}
