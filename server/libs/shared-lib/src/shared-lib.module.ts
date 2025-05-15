import { Module } from "@nestjs/common";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

@Module({
    imports: [RabbitMQModule],
    exports: [RabbitMQModule],
})
export class SharedLibModule {}