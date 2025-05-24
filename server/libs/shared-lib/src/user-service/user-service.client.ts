import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { UserInfo } from "../events/user.events";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserServiceClient {
    private readonly USER_SERVICE_URL: string | undefined;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.USER_SERVICE_URL = configService.get<string>('USER_SERVICE_URL');
        if (!this.USER_SERVICE_URL) {
            throw new Error('USER_SERVICE_URL is not defined'); 
        }
    }

    async validateUser(userId: string): Promise<{ isvalid: boolean; userInfo?: UserInfo }> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.USER_SERVICE_URL}/users/${userId}/validate`),
            );

            return { isvalid: true, userInfo: response.data };
        } catch (error) {
            return { isvalid: false };
        }
    }
}