import { Module } from "@nestjs/common";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";
import { UserServiceClientModule } from "./user-service/user-service.module";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: resolve(process.cwd(), 'libs/shared-lib/.env')
        }),
        RabbitMQModule, 
        UserServiceClientModule
    ],
    exports: [RabbitMQModule, UserServiceClientModule],
})
export class SharedLibModule {}