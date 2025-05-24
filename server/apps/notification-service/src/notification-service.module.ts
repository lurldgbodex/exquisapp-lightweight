import { Module } from '@nestjs/common';
import { NotificationService } from './notification-service.service';
import { EventHandlers } from './events/event.handlers';
import { EmailModule } from './emails/email.module';
import { RabbitMQModule, UserServiceClient } from 'libs/shared-lib/src';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), 'apps/notification-service/.env')
    }),
    EmailModule, 
    RabbitMQModule,
    HttpModule,
  ],
  providers: [NotificationService, EventHandlers, UserServiceClient],
})
export class NotificationServiceModule {}
