FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build wallet-service

EXPOSE 3002

CMD ["node", "dist/apps/wallet-service/main.js"]