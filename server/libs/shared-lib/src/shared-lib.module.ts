import { Module } from "@nestjs/common";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";
import { UserServiceClientModule } from "./user-service/user-service.module";

@Module({
    imports: [RabbitMQModule, UserServiceClientModule],
    exports: [RabbitMQModule, UserServiceClientModule],
})
export class SharedLibModule {}