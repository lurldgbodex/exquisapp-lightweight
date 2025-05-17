import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import { UserInfo } from "../events/user.events";

@Injectable()
export class UserServiceClient {
    constructor(private readonly httpService: HttpService) {}

    async validateUser(userId: string): Promise<{ isvalid: boolean; userInfo?: UserInfo }> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`http://localhost:3000/users/${userId}/validate`),
            );

            return { isvalid: true, userInfo: response.data };
        } catch (error) {
            return { isvalid: false };
        }
    }
}