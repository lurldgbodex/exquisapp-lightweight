import { Module } from '@nestjs/common';
import { NotificationService } from './notification-service.service';
import { EventHandlers } from './events/event.handlers';
import { EmailModule } from './email/email.module';
import { RabbitMQModule, UserServiceClient, UserServiceClientModule } from 'libs/shared-lib/src';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    EmailModule, 
    RabbitMQModule,
    HttpModule,
  ],
  providers: [NotificationService, EventHandlers, UserServiceClient],
})
export class NotificationServiceModule {}
