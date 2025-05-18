import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                verifyOptions: {
                    algorithms: ['HS256']
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [ConfigService],
    exports: [JwtModule]
})
export class AuthModule {}