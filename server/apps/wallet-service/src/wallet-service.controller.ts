import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet-service.service";
import { WalletDto } from "./dto/wallet.dto";
import { ServiceJwtGuard } from "libs/shared-lib/src/auth/service-jwt.guard";
import { Request } from "express";

@Controller('wallets')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get(':id/balance')
    @UseGuards(ServiceJwtGuard)
    async getWalletBalance(@Param('id') id: string) {
        return this.walletService.getWalletBalance(id);
    }

    @Post('/debit')
    @UseGuards(ServiceJwtGuard)
    async debitWallet(@Body() data: WalletDto) {
        return await this.walletService.debitWallet(data);
    }

    @Post('credit')
    @UseGuards(ServiceJwtGuard)
    async creditWallet(@Body() data: WalletDto) {
        return await this.walletService.creditWallet(data);
    }

    @Get('me')
    async getWallet(@Req() req: Request) {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new UnauthorizedException('missing required auth header')
        }

        return await this.walletService.getWallet(userId);
    }

}
