import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class ServiceJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);

        if (!token) {
            return false;
        }

        try {
            const payload = this.jwtService.verify(token, {
                secret: this.config.get('SERVICE_JWT_SERVICE') || 'service-jwt-secret',
            });
            req.service = payload;
            return true;
        } catch {
            return false;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const tokenWithBearer = request.headers['service-authorization']?.toString();
        const [type, token] = tokenWithBearer?.split(' ') ?? [];
        return type == 'Bearer'? token: undefined
    }
}