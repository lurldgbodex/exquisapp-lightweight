import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { catchError, firstValueFrom } from "rxjs";

@Injectable()
export class WalletServiceClient {
    constructor(
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async getBalance(userId: string) {
        try {
            const token = await this.generateToken();

            const response = await firstValueFrom(
                this.httpService.get(`http://localhost:3002/wallets/${userId}/balance`, 
                 {
                    headers: {
                        'service-authorization': `Bearer ${token}`,
                        'x-user-id': userId,
                    },
                 }
                ).pipe
                    (catchError((error) => {
                        throw new Error (`Wallet service error: ${error.message}`);
                    })
                ),
            );
            return response.data.balance;
        } catch (error) {
            console.error("failed to get balance:", error.message);
            throw new HttpException("Failed to retrieve wallet balance,", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async debitWallet(data: { userId: string; amount: number; reference: string }) {
        const token = await this.generateToken();

        await firstValueFrom(
            this.httpService.post(`http://localhost:3002/wallets/debit`, 
            data, {
                headers: {
                    'service-authorization': `Bearer ${token}`,
                    'x-user-id': data.userId
                }
            }
        ),
        );
    };

    async creditWallet(data: { userId: string; amount: number; reference: string}) {
        const token = await this.generateToken()
        await firstValueFrom(
            this.httpService.post(`http://localhost:3002/wallets/credit`, 
                data, {
                    headers: {
                        'service-authorization': `Bearer ${token}`,
                        'x-user-id': data.userId
                    }
                }
            ),
        );
    }

    async generateToken() {
        return await this.jwtService.sign(
            { issuer: 'payment-service' },
            { secret: this.configService.get('SERVICE_JWT_SECRET' ) || 'service-jwt-secret' }
        );
    }
}