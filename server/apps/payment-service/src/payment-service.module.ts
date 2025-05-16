import { Module } from '@nestjs/common';
import { PaymentController } from './payment-service.controller';
import { PaymentService } from './payment-service.service';
import { RabbitMQModule, UserServiceClient } from 'libs/shared-lib/src';
import { HttpModule } from '@nestjs/axios';
import { PaymentDatabaseModule } from './database/database.module';
import { PaymentPublisher } from './events/payment.publisher';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    HttpModule, RabbitMQModule, PaymentDatabaseModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, UserServiceClient, PaymentPublisher],
  exports: [PaymentService],
})
export class PaymentServiceModule {}
