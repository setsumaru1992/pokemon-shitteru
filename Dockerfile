# ビルドステージ
FROM node:20-slim AS builder

WORKDIR /app

# OpenSSLのインストール
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# 実行ステージ
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# OpenSSLのインストール
RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"] 