import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { RabbitMQModule } from "libs/shared-lib/src";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [EmailService, RabbitMQModule],
    exports: [EmailService]
})
export class EmailModule {}