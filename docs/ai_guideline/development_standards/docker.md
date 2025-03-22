# Docker環境

## 重要な注意点
- `docker-compose`コマンドは非推奨です。代わりに`docker compose`を使用してください
  - `docker compose`はDocker CLIの一部として組み込まれており、より新しい標準実装です
  - より良いパフォーマンスと将来的なサポートが保証されています
  - すべてのコマンドは`docker compose`形式で実行してください
- Compose ファイル（docker-compose.yml）では`version`フィールドは省略可能です
  - Docker Compose V2以降では不要になりました
  - 警告を避けるため、新規作成時は省略することを推奨します

## 基本ルール
- マルチステージビルドを使用
- キャッシュを活用
- セキュリティを考慮
- イメージサイズを最適化

```dockerfile
# 良い例
# ビルドステージ
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 実行ステージ
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]

# 悪い例
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## コンテナ操作
- コンテナ名を指定
- ボリュームを適切にマウント
- 環境変数を適切に設定
- ヘルスチェックを実装

```yaml
# 良い例
services:
  app:
    build: .
    container_name: pokemon-quiz-app
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/pokemon
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    depends_on:
      db:
        condition: service_healthy

# 悪い例
services:
  app:
    build: .
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/pokemon
    depends_on:
      - db
```

## 注意事項
- 機密情報は環境変数で管理
- ログを適切に出力
- リソース制限を設定
- セキュリティアップデートを適用

```yaml
# 良い例
services:
  app:
    build: .
    env_file:
      - .env
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    security_opt:
      - no-new-privileges:true
      - read-only-rootfs:true
    cap_drop:
      - ALL

# 悪い例
services:
  app:
    build: .
    environment:
      - DATABASE_PASSWORD=secret123  # 機密情報を直接指定
    # リソース制限なし
    # セキュリティ設定なし
```

## 運用ルール

### 1. 基本的なコンテナ操作
```bash
# 開発環境の起動（バックグラウンド）
docker compose up -d

# 開発環境の起動（ログを表示）
docker compose up

# コンテナの停止
docker compose stop

# コンテナとネットワークの削除
docker compose down

# コンテナ内でコマンドを実行
docker compose exec app npm run test

# コンテナのログを確認（最新50行）
docker compose logs --tail 50

# 特定のサービスのログをフォロー
docker compose logs -f app
```

### 2. トラブルシューティング
```bash
# コンテナの状態確認
docker compose ps

# コンテナの詳細情報
docker compose ps -a

# キャッシュを使わずに再ビルド
docker compose build --no-cache

# コンテナの再作成
docker compose down && docker compose up -d

# コンテナ内のシェルに接続
docker compose exec app sh

# ネットワークの確認
docker network ls
docker network inspect pokemon-quiz_default

# ボリュームの確認
docker volume ls
docker volume inspect pokemon-quiz_node_modules
```

### 3. パフォーマンス最適化
- ボリュームマウントの適切な使用
  ```yaml
  volumes:
    - .:/app  # ソースコードの変更を反映
    - /app/node_modules  # node_modulesは永続化
  ```
- 不要なファイルを`.dockerignore`に追加
  ```
  node_modules
  .git
  .env*
  *.log
  ```
- マルチステージビルドの活用（上記Dockerfile参照）
- 適切なベースイメージの選択（`-alpine`や`-slim`を使用）

### 4. 開発フロー
```bash
# 1. 環境の起動
docker compose up -d

# 2. 依存関係のインストール
docker compose exec app npm install

# 3. マイグレーションの実行
docker compose exec app npm run prisma:migrate

# 4. テストの実行
docker compose exec app npm run test

# 5. リントの実行
docker compose exec app npm run lint

# 6. ビルド
docker compose exec app npm run build
```

## トラブルシューティング
- ログの確認方法
- コンテナの状態確認
- ネットワークの確認
- ボリュームの確認

```bash
# 良い例
# ログの確認
docker logs -f pokemon-quiz-app

# コンテナの状態確認
docker ps -a

# ネットワークの確認
docker network inspect pokemon-quiz_default

# ボリュームの確認
docker volume ls

# コンテナ内でのデバッグ
docker exec -it pokemon-quiz-app sh

# 悪い例
# ログの確認なし
# コンテナの状態確認なし
# ネットワークの確認なし
# ボリュームの確認なし
```

## 開発フロー
- 開発環境の構築
- テスト環境の構築
- CI/CDパイプライン
- デプロイメント

```yaml
# 良い例
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Build and test
        run: |
          docker compose -f docker-compose.test.yml up --build --abort-on-container-exit
      - name: Run security scan
        run: |
          docker run --rm -v $(pwd):/app aquasec/trivy image pokemon-quiz-app:latest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          docker compose -f docker-compose.prod.yml up -d

# 悪い例
name: CI/CD

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: docker compose up -d  # テストなし、セキュリティスキャンなし
```

## コマンド実行環境の原則

### 環境依存コマンドの実行
1. **Dockerコンテナ内での実行を優先**
   - npm, yarn等のパッケージマネージャコマンド
   - データベースマイグレーションコマンド
   - 環境設定に依存するビルドコマンド

2. **実行環境の統一**
   - 開発チーム間での環境差異を防ぐ
   - CI/CD環境との一貫性を保つ
   - バージョンの統一管理

3. **推奨されるアプローチ**
   ```
   良い例：
   - Dockerコンテナ内でのnpm install実行
   - コンテナ内でのマイグレーション実行
   - docker-compose execを使用した実行
   
   悪い例：
   - ホストマシンでの直接的なnpm install
   - 環境依存のコマンドをホストで実行
   - バージョン管理されていない環境での実行
   ```