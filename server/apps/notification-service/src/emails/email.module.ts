import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { RabbitMQModule } from "libs/shared-lib/src";

@Module({
    providers: [EmailService, RabbitMQModule],
    exports: [EmailService]
})
export class EmailModule {}