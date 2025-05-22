import { Controller, Get, HttpCode, HttpStatus, Req, UnauthorizedException } from "@nestjs/common";
import { BillingService } from "./billing-service.service";
import { Request } from "express";

@Controller('billings')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @Get('me/transactions')
    @HttpCode(HttpStatus.OK)
    async getUserTransactions(@Req() req: Request) {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new UnauthorizedException('missing required auth header');
        }

        return await this.billingService.getUserBillingRecords(userId);
    }
}