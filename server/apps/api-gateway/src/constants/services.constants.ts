import { ServiceConfig } from "../interfaces/service-config.interface";

export const SERVICES_CONFIG: ServiceConfig[] = [
    {
        name: 'user-service',
        path: '/users',
        url: process.env.USER_SERVICE_URL || 'http://localhost:3001'
    },
    {
        name: 'user-service',
        path: '/auths',
        url: process.env.USER_SERVICE_URL || 'http://localhost:3001'
    },
    {
        name: 'wallet-service',
        path: '/wallets',
        url: process.env.WALLET_SERVICE_URL || 'http://localhost:3002'
    },
    {
        name: 'payment-service',
        path: '/payments',
        url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003'
    },
    {
        name: 'billing-service',
        path: '/billings',
        url: process.env.BILLING_SERVICE_URL || 'http://localhost:3004'
    }
]