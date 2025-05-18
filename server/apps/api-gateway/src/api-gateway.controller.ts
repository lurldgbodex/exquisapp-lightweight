import { All, Controller, Request, Response, UseGuards } from "@nestjs/common";
import { ApiGatewayService } from "./api-gateway.service";
import { Request as ExpressRequest, Response as ExpressResponse} from 'express';
import { AuthGuard } from "./auth/auth.guard";

@Controller()
export class ApiGatewayController {
    constructor(private readonly apiGatewayService: ApiGatewayService) {}

    @All("/users/*path")
    @UseGuards(AuthGuard)
    async proxyUserService(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
        this.apiGatewayService.getproxy('/users')(req, res);
    }

    @All("/auths/*path")
    async proxyAuthService(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
        this.apiGatewayService.getproxy('/auths')(req, res);
    }

    @All('/wallets/*path')
    @UseGuards(AuthGuard)
    async proxyWalletService(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
        this.apiGatewayService.getproxy('/wallets')(req, res);
    }

    @All('/payments/*path')
    @UseGuards(AuthGuard)
    async proxyPaymentService(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
        this.apiGatewayService.getproxy('/payments')(req, res);
    }
}