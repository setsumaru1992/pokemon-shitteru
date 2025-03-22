# ポケモンクイズシステム コーディングガイドライン

## 1. プロジェクト構造

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

### 1.1 ディレクトリの責務

#### app/
- Next.jsのページコンポーネントとAPIルートを配置
- APIルートは`app/api`配下に配置
- ページコンポーネントは`app/(routes)`配下に配置

#### backend/
- バックエンド固有のコードを配置
- `prisma/`: データベース関連のコード
  - `schema.prisma`: データベーススキーマ定義
  - `generated/`: Prismaが生成するクライアントコード
- `domain/`: ドメインモデルとビジネスロジック
  - 各ドメイン（例：`room/`）は以下の構造を持つ
    - ドメインモデル（例：`Room.ts`）
    - `commands/`: 状態を変更する操作
    - `queries/`: 状態を参照する操作

#### frontend/
- フロントエンド固有のコードを配置
- `components/`: 再利用可能なUIコンポーネント
- `features/`: 機能単位のコンポーネントとロジック
- `api/`: APIクライアント
- `lib/`: フロントエンド共通ユーティリティ

## 2. コーディング規約

### 2.1 全般的なルール
- インデントは2スペースを使用
- セミコロンは必須
- 文字列はシングルクォート（'）を使用
- オブジェクトのプロパティ名はキャメルケース
- 型定義はPascalCase
- ファイル名はケバブケース（例: `pokemon-list.tsx`）

### 2.2 TypeScript
- `any`型の使用は禁止
- 明示的な型定義を推奨
- Zodによるバリデーションスキーマの型を活用
- ジェネリック型の活用を推奨

### 2.3 Reactコンポーネント
- 関数コンポーネントとアロー関数を使用
- Props型は必ず定義
- コンポーネントファイルは`.tsx`拡張子を使用
- カスタムフックは`use`プレフィックスを使用

```typescript
// 良い例
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (...)
}

// 悪い例
function PokemonCard(props) {
  return (...)
}
```

### 2.4 状態管理
- ローカル状態には`useState`を使用
- 複雑な状態管理には`useReducer`を検討
- グローバル状態は最小限に抑える

### 2.5 API通信
- API Routesのエンドポイントは`/api`プレフィックス
- エラーハンドリングは必須
- レスポンス型は明示的に定義
- Zodによる入力バリデーションを実装

### 2.6 データベース操作
- Prismaクライアントを使用
- トランザクションを適切に使用
- N+1問題に注意
- インデックスを適切に設定

### 2.7 テスト
- ユニットテストは必須
- テストファイルは`.test.ts(x)`または`.spec.ts(x)`
- モックは最小限に抑える
- E2Eテストは重要な機能のみ

## 3. 命名規則

### 3.1 変数名
- 説明的な名前を使用
- 略語は避ける
- boolean値は`is`、`has`、`should`などのプレフィックスを使用

```typescript
// 良い例
const isLoading = true;
const hasError = false;
const pokemonList = [...];

// 悪い例
const loading = true;
const err = false;
const list = [...];
```

### 3.2 関数名
- 動詞で開始
- 目的を明確に示す
- 副作用がある場合は明示的に

```typescript
// 良い例
const fetchPokemonList = async () => {...}
const updatePokemonStatus = async () => {...}

// 悪い例
const pokemon = () => {...}
const doUpdate = async () => {...}
```

### 3.3 コンポーネント名
- PascalCase
- 具体的な役割を示す
- 親コンポーネント名をプレフィックスとして使用可

```typescript
// 良い例
PokemonList
PokemonListItem
PokemonDetailCard

// 悪い例
List
Item
Card
```

## 4. パフォーマンス最適化

### 4.1 レンダリング最適化
- `useMemo`と`useCallback`を適切に使用
- 大きなリストには仮想化を検討
- 画像は最適化して使用

### 4.2 データ取得
- SWRまたはReact Queryを使用
- 適切なキャッシュ戦略
- ページネーションの実装

## 5. セキュリティ

### 5.1 一般的なセキュリティ
- 環境変数は`.env`で管理
- 機密情報はクライアントに露出しない
- CSRFトークンの実装
- XSS対策の実装

### 5.2 入力バリデーション
- すべてのユーザー入力をバリデーション
- Zodスキーマを使用
- サーバーサイドでも必ずバリデーション

## 6. アクセシビリティ

### 6.1 基本ルール
- セマンティックなHTML
- キーボード操作のサポート
- スクリーンリーダー対応
- 適切なコントラスト比

### 6.2 WAI-ARIA
- 適切なaria属性の使用
- ランドマークの設定
- フォーカス管理 

## 7. テストファースト開発アプローチ

### 7.1 基本方針
- ビジネスロジックの実装前にテストを作成
- テストが失敗する状態を確認してから実装
- 実装後、テストがパスすることを確認
- 複雑なロジックには必ずテストを作成

### 7.2 バックエンドテスト
- ビジネスロジックは必ずテストを作成
- 単純なルーティングやフレームワーク機能のテストは不要
- データベース操作を含むロジックはモックを使用
- エッジケースを考慮したテストケースを作成

```typescript
// 良い例：ポケモン回答チェックのテスト
describe('PokemonAnswerService', () => {
  it('正しい回答を検証できる', () => {
    const service = new PokemonAnswerService();
    const answer = { pokemonName: 'ピカチュウ', pokedexNumber: 25 };
    expect(service.validateAnswer(answer)).toBeTruthy();
  });

  it('不正な図鑑番号の回答を検出できる', () => {
    const service = new PokemonAnswerService();
    const answer = { pokemonName: 'ピカチュウ', pokedexNumber: 9999 };
    expect(service.validateAnswer(answer)).toBeFalsy();
  });
});
```

### 7.3 フロントエンドテスト
- 複雑なビジネスロジックは必ずテスト作成
- ユーザーインタラクションのテスト
- カスタムフックのテスト
- コンポーネントの単体テスト（必要な場合）

```typescript
// 良い例：回答入力フォームのカスタムフックテスト
describe('useAnswerValidation', () => {
  it('正しい入力形式を検証できる', () => {
    const { result } = renderHook(() => useAnswerValidation());
    act(() => {
      result.current.validateInput('ピカチュウ');
    });
    expect(result.current.isValid).toBeTruthy();
  });
});
```

### 7.4 テスト実行のタイミング
- 新規実装時は必ずテストを実行
- 既存コードの修正時もテストを実行
- CIでの自動テスト実行を設定
- テストカバレッジの定期的な確認

### 7.5 テストの品質管理
- テストケースは明確な目的を持つ
- テストの可読性を重視
- 不要なテストは作成しない
- テストのメンテナンス性を考慮

```typescript
// 良い例：テストケースの命名と構造
describe('RoomService', () => {
  describe('createRoom', () => {
    it('有効な設定で部屋を作成できる', async () => {
      // テストコード
    });

    it('無効な設定でエラーを返す', async () => {
      // テストコード
    });
  });
});
```

### 7.6 テスト対象の判断基準
バックエンド:
- ビジネスロジックを含むサービス層
- データ変換や加工処理
- バリデーションロジック
- 複雑なデータベース操作

フロントエンド:
- フォームのバリデーションロジック
- 状態管理の複雑なロジック
- データ変換や加工処理
- カスタムフックの処理

テスト不要な項目:
- フレームワークの基本機能
- 単純なGetter/Setter
- 単純なルーティング定義
- シンプルなUIコンポーネント 

## 8. Docker環境での開発

### 8.1 基本ルール
- 言語やライブラリに依存するコマンドは全てDockerコンテナ内で実行
- テストの実行もコンテナ内で行う
- コンテナの起動後は必ず`docker compose ps`で状態を確認

### 8.2 コンテナ操作の基本手順
```bash
# コンテナの起動
docker compose up -d

# 起動確認
docker compose ps

# コンテナ内でのコマンド実行
docker compose exec app npm run test

# コンテナの停止
docker compose down
```

### 8.3 注意事項
- 既存のサーバーが動いている場合は、新規起動前に停止する
  ```bash
  docker compose down
  ```
- ポート3000の重複に注意（複数サーバーの同時起動は避ける）
- コンテナ内での操作結果はホストのファイルシステムに反映される
- 環境変数は`.env`ファイルで管理し、コンテナ内に適切に渡す

### 8.4 トラブルシューティング
問題発生時の対応手順：

1. コンテナの状態確認
   ```bash
   docker compose ps
   ```

2. ログの確認
   ```bash
   docker compose logs --tail 50 {コンテナ名}
   ```

3. コンテナの再起動
   ```bash
   docker compose restart
   ```

4. コンテナの再作成
   ```bash
   docker compose down && docker compose up -d
   ```

### 8.5 開発フロー
1. コンテナの起動
   ```bash
   docker compose up -d
   docker compose ps  # 起動確認
   ```

2. テストの実行
   ```bash
   docker compose exec app npm run test
   ```

3. アプリケーションの動作確認
   ```bash
   docker compose logs -f app  # ログの監視
   ```

4. 開発終了時
   ```bash
   docker compose down
   ``` 

## 9. アーキテクチャ設計

### 9.1 バックエンド設計原則
- ルーティング層（コントローラー）には副作用のあるビジネスロジックを書かない
- ビジネスロジックはドメイン層に集約する
- 副作用のあるビジネスロジックは`Command`として実装
- 参照系の操作は必要に応じてコントローラーから直接アクセス可能

```typescript
// 良い例：Commandパターンの実装
// domain/commands/create-room-command.ts
export class CreateRoomCommand {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(config: RoomConfig): Promise<Room> {
    const room = Room.create(config);
    await this.roomRepository.save(room);
    return room;
  }
}

// app/api/rooms/route.ts
export async function POST(req: Request) {
  const command = new CreateRoomCommand(roomRepository);
  const room = await command.execute(req.body);
  return Response.json(room);
}

// 悪い例：コントローラーでのビジネスロジック実装
export async function POST(req: Request) {
  const room = new Room(req.body);
  await prisma.rooms.create({ data: room }); // ビジネスロジックがコントローラーに漏れている
  return Response.json(room);
}
```

### 9.2 フロントエンド設計原則
- APIクライアントは`src/api`ディレクトリに集約
- ページコンポーネントからのAPI呼び出しは`api`ディレクトリ経由で行う
- 複雑なデータ加工ロジックは`features`ディレクトリに配置

```typescript
// 良い例：APIクライアントの分離
// src/api/rooms.ts
export const roomsApi = {
  create: async (config: RoomConfig) => {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    return response.json();
  }
};

// src/app/rooms/new/page.tsx
import { roomsApi } from '@/api/rooms';

export default function CreateRoomPage() {
  const handleSubmit = async (config: RoomConfig) => {
    const room = await roomsApi.create(config);
    // ...
  };
}

// 悪い例：ページでの直接API呼び出し
export default function CreateRoomPage() {
  const handleSubmit = async (config: RoomConfig) => {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(config),
    });
    // ...
  };
}
```

### 9.3 ドメインモデリング
- ドメインモデルは`src/domain/models`に配置
- ドメインモデルはビジネスルールをカプセル化
- バリデーションロジックはドメインモデル内に実装

```typescript
// 良い例：ドメインモデルの実装
// src/domain/models/room.ts
export class Room {
  private constructor(
    private readonly config: RoomConfig,
    private readonly code: string,
  ) {}

  static create(config: RoomConfig): Room {
    if (!this.isValidConfig(config)) {
      throw new Error('Invalid room configuration');
    }
    const code = this.generateUniqueCode();
    return new Room(config, code);
  }

  private static isValidConfig(config: RoomConfig): boolean {
    // ビジネスルールに基づくバリデーション
    return true;
  }
}
```

### 9.4 レイヤー間の依存関係
- 上位レイヤーから下位レイヤーへの依存のみ許可
- 依存の方向：UI層 → アプリケーション層 → ドメイン層
- 循環参照は禁止

### 9.5 コマンドとクエリの分離
- Command: 状態を変更する操作（作成、更新、削除）
- Query: 状態を参照する操作（検索、取得）
- 同一メソッド内でのCommandとQueryの混在は避ける 