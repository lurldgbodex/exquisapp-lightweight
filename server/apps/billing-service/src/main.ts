import { NestFactory } from '@nestjs/core';
import { BillingServiceModule } from './billing-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingServiceModule);
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
