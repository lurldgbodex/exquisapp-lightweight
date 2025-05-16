import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWOR,
            database: process.env.DB_NAME || 'user_db',
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
        }),
    ],
})
export class DatabaseModule {}
