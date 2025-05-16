import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class WalletServiceClient {
    constructor(private readonly httpService: HttpService) {}

    async getBalance(userId: string): Promise<number> {
        const response = await firstValueFrom(
            this.httpService.get(`http://localhost:3100/wallets/${userId}/balance`),
        );
        return response.data.balance;
    }

    async debitWallet(data: { userId: string; amount: number; reference: string }) {
        await firstValueFrom(
            this.httpService.post(`http://localhost:3100/wallets/debit`, data),
        );
    };

    async creditWallet(data: { userId: string; amount: number; reference: string}) {
        await firstValueFrom(
            this.httpService.post(`http://localhost:3100/wallets/credit`, data),
        );
    }
}