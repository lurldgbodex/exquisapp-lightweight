import { Global, Module } from "@nestjs/common";
import { UserServiceClient } from "./user-service.client";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
    imports: [HttpModule],
    providers: [UserServiceClient],
    exports: [UserServiceClient],
})
export class UserServiceClientModule {}