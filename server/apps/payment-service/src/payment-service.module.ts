import { Module } from '@nestjs/common';
import { PaymentController } from './payment-service.controller';
import { PaymentService } from './payment-service.service';
import { RabbitMQModule, ServiceJwtGuard, UserServiceClient, WalletServiceClient } from 'libs/shared-lib/src';
import { HttpModule } from '@nestjs/axios';
import { PaymentDatabaseModule } from './database/database.module';
import { PaymentPublisher } from './events/payment.publisher';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), 'apps/payment-service/.env')
      
    }),
    HttpModule, 
    RabbitMQModule, 
    PaymentDatabaseModule,
    JwtModule, ConfigModule,
  ],
  providers: [
    PaymentService, 
    UserServiceClient, 
    PaymentPublisher, 
    WalletServiceClient,
    ServiceJwtGuard,
  ],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentServiceModule {}
