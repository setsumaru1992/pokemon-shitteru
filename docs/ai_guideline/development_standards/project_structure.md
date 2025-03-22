# プロジェクト構造

## ディレクトリ構造

```
src/
├── app/              # Next.jsのページコンポーネントとAPIルート
│   ├── api/         # APIエンドポイント
│   └── (routes)/    # ページコンポーネント
│
├── backend/         # バックエンド固有のコード
│   ├── prisma/     # Prisma関連ファイル
│   │   ├── schema.prisma
│   │   └── generated/
│   └── domain/     # ドメインモデル、ビジネスロジック
│       └── room/   # Roomドメイン
│           ├── Room.ts
│           ├── commands/
│           └── queries/
│
└── frontend/       # フロントエンド固有のコード
    ├── components/ # 再利用可能なUIコンポーネント
    ├── features/   # 機能単位のコンポーネントとロジック
    ├── api/        # APIクライアント
    └── lib/        # フロントエンド共通ユーティリティ
```

## 各ディレクトリの責務

### app/
- Next.jsのページコンポーネントとAPIルートを配置
- APIルートは`app/api`配下に配置
- ページコンポーネントは`app/(routes)`配下に配置

### backend/
- バックエンド固有のコードを配置
- `prisma/`: データベース関連のコード
  - `schema.prisma`: データベーススキーマ定義
  - `generated/`: Prismaが生成するクライアントコード
- `domain/`: ドメインモデルとビジネスロジック
  - 各ドメイン（例：`room/`）は以下の構造を持つ
    - ドメインモデル（例：`Room.ts`）
    - `commands/`: 状態を変更する操作
    - `queries/`: 状態を参照する操作

### frontend/
- フロントエンド固有のコードを配置
- `components/`: 再利用可能なUIコンポーネント
- `features/`: 機能単位のコンポーネントとロジック
- `api/`: APIクライアント
- `lib/`: フロントエンド共通ユーティリティ 