FROM node:slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build api-gateway

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main.js"]