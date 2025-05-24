import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';                   
import { resolve } from 'path';
import * as dotenv    from 'dotenv';

const envPath = resolve(process.cwd(), 'apps/user-service/.env');
dotenv.config({ path: envPath });

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
  .setTitle('User Service API')
  .setDescription('The user service API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.port ?? 3001);
}
bootstrap();
