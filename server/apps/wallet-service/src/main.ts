import { NestFactory } from '@nestjs/core';
import { WalletServiceModule } from './wallet-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(WalletServiceModule);

    
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    
    const config = new DocumentBuilder()
    .setTitle('Wallet Service API')
    .setDescription('The Wallet service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
  
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
