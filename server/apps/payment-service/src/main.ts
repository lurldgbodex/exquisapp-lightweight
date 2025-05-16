import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);

  app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    
    const config = new DocumentBuilder()
    .setTitle('Payment Service API')
    .setDescription('The Payment service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port ?? 3200);
}
bootstrap();
