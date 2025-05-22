# MoneyPal Payments - Frontend Application
## Overview
This is the frontend application for the MoneyPal Payment system, built with Ract, Typescript and Material-UI. The application provides a user interface for managing wallet transactions, including deposit, transfers, and viewing transaction history.

## Freatures
- User Authentication
  - Login and registration
  - Jwt token management
  - Protected routes
- Wallet Management
  - View current balance
  - Deposit funds
  - Transfer funds to other users
  - view transacton history
- Transaction Tracking
  - Filter transactions by type (deposits/transfer)
  - view transaction status (completed/pending/failed)
  - see transaction timestamps
- User Experience
  - Responsive design
  - Loading states and error handling

## Technologies Used
- Frontend Framework: React
- Language: Typescript
- UI Library: Material-UI(MUI)
- State Management: React Query
- Routing: React Router
- Form Handling: React Hook Form + Zod Validation
- Http Client; Axios
- Date Handling: date-fns
- Build Tool: vite

## Prerequisite
- Ensure the backend services are alreay running.

## Installation
1. Clone the repository:
```bash
git clone https://github.com/lurldgbodex/exquisapp-lightweight.git
cd client
```

2. Install dependencies
```bash
npm install
```

## Available scripts
- `npm run dev`: start development server
- `npm run build`: build for production

## API Integration
The frontend expects the following Api endpoints:

### Authentication
- `POST /auths/login` - user login
- `POST /auths/register` - user registration
- `GET /users/me` - Get current user info

### Wallet
- `GET /wallets/me` - Get wallet details
- `POST /payments/transact` - Deposit funds
- `POST /payments/transact` - Transfer funds
- `GET /billings/me/transactions` - Get transaction history (returns { deposits, transfers })
