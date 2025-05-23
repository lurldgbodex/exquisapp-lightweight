FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build billing-service

EXPOSE 3004

CMD ["node", "dist/apps/billing-service/main.js"]