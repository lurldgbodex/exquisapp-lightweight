import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { WalletService } from "./wallet-service.service";
import { WalletDto } from "./dto/wallet.dto";

@Controller('wallets')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get(':id/balance')
    async getWalletBalance(@Param('id') id: string) {
        return this.walletService.getWalletBalance(id);
    }

    @Post('/debit')
    async debitWallet(@Body() data: WalletDto) {
        return await this.walletService.debitWallet(data);
    }

    @Post('credit')
    async creditWallet(@Body() data: WalletDto) {
        return await this.walletService.creditWallet(data);
    }

}
