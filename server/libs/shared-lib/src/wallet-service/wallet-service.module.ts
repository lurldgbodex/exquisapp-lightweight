import { Global, Module } from "@nestjs/common";
import { WalletServiceClient } from "./wallet-service.client";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
    imports: [HttpModule],
    providers: [WalletServiceClient],
    exports: [WalletServiceClient],
})
export class WalletServiceClientModule {}