FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build payment-service

EXPOSE 3003

CMD ["node", "dist/apps/payment-service/main.js"]