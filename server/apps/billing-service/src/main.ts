import { NestFactory } from '@nestjs/core';
import { BillingServiceModule } from './billing-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BillingServiceModule);

    app.enableCors({
      origin: 'http://localhost:5173',
      credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());
    
    const config = new DocumentBuilder()
    .setTitle('Billing Service API')
    .setDescription('The Billing service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port ?? 3004);
}
bootstrap();
