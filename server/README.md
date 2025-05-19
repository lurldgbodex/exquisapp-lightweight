# MoneyPal Microservices Backend

A micorservice-based backend for a fictitious marketplace system, built with NestJs using monorepo approach. This system facilitates user registration, wallet management, payment processing, billing and notifications.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Services Overview](#services-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the System](#ruuning-the-system)
- [Api Documentation](#api-documentation)
- [Event Flow](#event-flow)
- [Testing](#testing)

## Features

**- User Management:** User registration and authentication
**- Wallet System:** Virtual wallets with credit/debit capabilities
**- Payment Processing:** User payment transactions
**- Billing System:** Handles transactions between client and provider wallets
**- Notifications:** Email notifications for payment activities
**- Event-Driven Architecture:** Services communicate via message broker
**- Database Per Service:** Isolated data storage for each microservice

## Architecture

The system follows a microservice architecture with these key components:

- **API Gateway:** Single entry point for all client requests
- **Core Services:** User, Wallet, Payment, Billing, and Notification services
- **Message Broker:** RabbitMQ for event-driven communication
- **Database Per Service:** Each service has its own dedicated database
- **Shared Libraries:** Common utilities and services

## Services Overview

### User Service

- handles user registration and authentication
- manages user profiles
- publishes `UserCreated` events

### Wallet Service

- manages virtual wallets
- handles balance updates and transactions
- provides wallet-to-wallet transfer capablitites

### Payment Service

- process payment intents
- publishes `paymentCompleted` events

### Billing Service

- creates billing records
- Orchestrates wallet transfers
- publishes `WalletCreated` and `WalletDebited` events

### Notification Service

- sends email notifications
- subscribes to payment, wallet and user events
- manages notification templates

### Api Gateway

- Routes requests to appropriate servcie
- handles authentication
- aggregates responses when needed

## Prerequisites

Before running the application, ensure you have installed:

- Node.js (v18 or later)
- npm or yarn
- Docker

## Installation

1. Clone the repository

```bash
git clone https://github.com/lurldgbodex/exquisapp-lightweight.git
cd server
```

2. Install dependencies

```bash
npm install
```

3. set up environment variables

- create a .env file at the root of the services with the database and jwt configurations

## Configuration

Configure each service and the shared lib by editing the respective `.env` file in each service directory. Key configuration options include:

- Database connections
- jwt secret keys
- email service credentials

## Ruuning the system

Run the individual services by running:

```bash
npm run start:dev ${service-name}
```

substitute the ${service-name} with the name of the service e.g user-service, wallet-service ...

## Api Documentation

Api documentation is available via swagger ui when running in dev mode:

- Api Gateway: `http://localhost:3000/api`
- User Servcie: `http://localhost:3001/api`
- Wallet Service: `http://localhost:3002/api`
- Payment Service: `http://localhost:3003/api`

## Event Flow

### Payment Processing Flow

1. client -> Api Gateway -> Payment Service: Initiate payment
2. Payment Service processes payment -> publishes `PaymentCompleted`
3. Billing Service:

- Receives `PaymentCompleted` -> creates billing record
- initiates wallet transfer -> publishes `walletCredited` and `WalletDebited`

4. Notification Service:

- receives `PaymentCompleted` -> sends "Payment Initiated" email
- receives `WalletCredited`/`WalletDebited` -> sends "Wallet credited/debit" email

### User Registration Flow

1. Client -> Api Gateway -> User Service: Register User
2. User Service creates User -> Publishes `UserRegistered`
3. Wallet Service receives `UserRegistered` -> creates wallet for new user
4. Notification Service receives `UserRegistered` -> sends "welcome email"

## Testing

### Run unit tests:

```bash
npm test
```

### Run integrated tests:

```bash
npm run test:e2e
```
