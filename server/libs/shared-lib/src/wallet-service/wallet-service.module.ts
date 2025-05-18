import { Global, Module } from "@nestjs/common";
import { WalletServiceClient } from "./wallet-service.client";
import { HttpModule } from "@nestjs/axios";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
    imports: [HttpModule],
    providers: [WalletServiceClient, JwtService],
    exports: [WalletServiceClient],
})
export class WalletServiceClientModule {}