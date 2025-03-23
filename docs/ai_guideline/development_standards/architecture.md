# アーキテクチャ設計ガイドライン

## 基本方針

1. シンプルさを優先する
   - 過度な抽象化は避ける
   - 必要に応じて段階的に改善する
   - アーキテクチャの変更は、実際に必要になった時点で行う

2. 依存性の扱い
   - 基本的にDIは不要
   - 必要なモジュールは直接importして使用
   - テスト時のみ依存性の注入を検討
   - CommandやQueryはRepositoryを直接importして初期化
   - Repositoryは引数でPrismaを受け取る必要はない

3. データベースアクセス
   - Commandは必ずRepositoryを経由してDBにアクセス
   - Repositoryは直接Prismaを使用して良い
   - Repositoryは引数でPrismaを受け取る必要はない
   - CommandやQueryはDBを直接触らない

4. パス解決
   - 相対パスを使用
   - エイリアス（@/）は使用しない

5. インターフェース
   - 必要に応じて段階的に導入
   - アーキテクチャの変更時のみ検討
   - 過度な抽象化は避ける

6. コマンド実行
   - Prismaのコマンドは`package.json`に定義されたスクリプトを使用
   - テスト実行はDockerコンテナ内で行う（`docker exec pokemon-shitteru-app-1 npm test`）
   - 環境依存のコマンドは全てDockerコンテナ内で実行 