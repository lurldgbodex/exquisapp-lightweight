import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SharedLibModule } from 'libs/shared-lib/src';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
     }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SharedLibModule,
  ],
})
export class UserServiceModule {}
