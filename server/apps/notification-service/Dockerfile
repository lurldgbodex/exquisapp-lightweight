FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build notification-service

EXPOSE 3005

CMD ["node", "dist/apps/notification-service/main.js"]