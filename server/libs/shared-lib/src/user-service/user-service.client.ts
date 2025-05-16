import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";

@Injectable()
export class UserServiceClient {
    constructor(private readonly httpService: HttpService) {}

    async validateUser(userId: string): Promise<{ isvalid: boolean; userInfo?:any }> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${process.env.USER_SERVICE_URL}/users/${userId}/validate`),
            );

            return { isvalid: true, userInfo: response.data };
        } catch (error) {
            return { isvalid: false };
        }
    }
}