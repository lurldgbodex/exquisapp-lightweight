import { Injectable, Logger } from "@nestjs/common";
import { SERVICES_CONFIG } from "./constants/services.constants";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiGatewayService {
    private services: Record<string, string> = {};
    private readonly logger = new Logger(ApiGatewayService.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {
        SERVICES_CONFIG.forEach(service => {
            this.services[service.path] = service.url;
        });
    }

    getproxy(servicePath: string) {
        const target = this.services[servicePath];
        if (!target) {
            throw new Error(`Service ${servicePath} not found`);
        }

        return createProxyMiddleware({
            target,
            changeOrigin: true,
            on: {
                proxyReq: (proxyReq, req: Request, res: Response) => {
                    this.logger.log(`proxying request to ${servicePath}`);

                    if (req.user) {
                        Logger.log(req.user);
                        proxyReq.setHeader('x-user-id', req.user['sub']);
                    }

                    if (req.headers.authorization) {
                        proxyReq.setHeader('authorization', req.headers.authorization);
                    } else {
                        
                    }

                    if (!req.headers['service-authorization']) {
                        const serviceToken = this.jwtService.sign(
                            { issuer: 'api-gateway' },
                            { secret: this.config.get<string>('SERVICE_JWT_SECRET')}
                        );

                        proxyReq.setHeader('service-authorization', `Bearer ${serviceToken}`);
                    };

                    fixRequestBody(proxyReq, req);
                },
                error: (err, req, res: Response) => {
                    this.logger.error('Proxy error:', err.message);
                    res.status(502).json({message: 'Bad Gateway'})
                }
            },
            ws: true,
            logger: console,
        })
    }
}