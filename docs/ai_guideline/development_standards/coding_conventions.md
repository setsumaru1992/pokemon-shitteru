# コーディング規約

## 全般的なルール
- コードは自己文書化を心がける
- コメントは「なぜ」を説明する
- 1つの関数は1つの責務を持つ
- 関数は20行以内に収める
- クラスは200行以内に収める

## TypeScript
- 型定義は明示的に行う
- `any`型の使用は禁止
- インターフェースは`I`プレフィックスを使用しない
- 型エイリアスは`T`プレフィックスを使用しない

```typescript
// 良い例
interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
}

type PokemonType = 'fire' | 'water' | 'grass';

// 悪い例
interface IPokemon {  // Iプレフィックス不要
  id: number;
  name: string;
  types: any[];  // any型の使用禁止
}
```

## Reactコンポーネント
- 関数コンポーネントを使用
- Props型は明示的に定義
- コンポーネントは単一責任の原則に従う
- 副作用は`useEffect`で管理

```typescript
// 良い例
interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
  return (
    <div onClick={() => onSelect(pokemon)}>
      <h3>{pokemon.name}</h3>
      <p>Types: {pokemon.types.join(', ')}</p>
    </div>
  );
};

// 悪い例
export const PokemonCard = ({ pokemon, onSelect }) => {  // 型定義なし
  return (
    <div onClick={() => onSelect(pokemon)}>
      <h3>{pokemon.name}</h3>
      <p>Types: {pokemon.types.join(', ')}</p>
    </div>
  );
};
```

## 状態管理
- グローバル状態は最小限に抑える
- コンポーネントの状態は`useState`で管理
- 複雑な状態管理は`useReducer`を使用
- 状態の更新は不変性を保つ

```typescript
// 良い例
const [pokemons, setPokemons] = useState<Pokemon[]>([]);

const addPokemon = (newPokemon: Pokemon) => {
  setPokemons(prev => [...prev, newPokemon]);
};

// 悪い例
const [pokemons, setPokemons] = useState<Pokemon[]>([]);

const addPokemon = (newPokemon: Pokemon) => {
  pokemons.push(newPokemon);  // 直接の変更は禁止
  setPokemons(pokemons);
};
```

## API通信
- APIクライアントは`src/frontend/api`に配置
- エラーハンドリングは統一的な方法で行う
- リクエスト/レスポンスの型は明示的に定義
- キャッシュ戦略を考慮する

```typescript
// 良い例
interface PokemonResponse {
  id: number;
  name: string;
  types: PokemonType[];
}

const fetchPokemon = async (id: number): Promise<PokemonResponse> => {
  try {
    const response = await fetch(`/api/pokemon/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pokemon');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    throw error;
  }
};

// 悪い例
const fetchPokemon = async (id: number) => {  // 型定義なし
  const response = await fetch(`/api/pokemon/${id}`);
  return response.json();  // エラーハンドリングなし
};
```

## データベース操作
- Prismaクライアントは`src/backend/prisma`で一元管理
- トランザクションは明示的に定義
- クエリは型安全に記述
- N+1問題に注意

```typescript
// 良い例
const getPokemonWithTypes = async (id: number) => {
  return prisma.pokemon.findUnique({
    where: { id },
    include: { types: true }
  });
};

// 悪い例
const getPokemonWithTypes = async (id: number) => {
  const pokemon = await prisma.pokemon.findUnique({ where: { id } });
  const types = await prisma.type.findMany({ where: { pokemonId: id } });  // N+1問題
  return { ...pokemon, types };
};
```

## テスト
- テストは実装と同時に書く
- テストケースは具体的なシナリオを記述
- モックは最小限に抑える
- テストの独立性を保つ

```typescript
// 良い例
describe('PokemonCard', () => {
  it('should display pokemon name and types', () => {
    const pokemon = {
      id: 1,
      name: 'Bulbasaur',
      types: ['grass', 'poison']
    };
    render(<PokemonCard pokemon={pokemon} onSelect={jest.fn()} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Types: grass, poison')).toBeInTheDocument();
  });
});

// 悪い例
describe('PokemonCard', () => {
  it('should work', () => {  // テストの意図が不明確
    render(<PokemonCard pokemon={{} as Pokemon} onSelect={jest.fn()} />);
    // アサーションなし
  });
});
```

## データベース設計とスキーマ変更

### スキーマ変更の原則
1. **既存のスキーマ設計を尊重**
   - カラム名には意味のある命名が施されている
   - 安易な名称変更は避け、設計意図を理解する
   - 例：`quizConfig`は「クイズに関する設定」という明確な意図がある

2. **データ移行への配慮**
   - 本番環境では大量のレコードが存在する可能性を考慮
   - スキーマ変更はデータ移行コストを伴うことを認識
   - 変更の必要性と影響範囲を慎重に評価

3. **変更提案のプロセス**
   - 既存の設計意図の理解を優先
   - 変更による利点と影響範囲の明確化
   - 段階的な移行計画の検討

### 推奨されるアプローチ
```
良い例：
- 既存のカラム定義を活用（例：quizConfigの利用）
- 新規機能追加時は既存の設計パターンに従う
- 変更が必要な場合は移行計画を含めて提案

悪い例：
- 安易なカラム名の変更
- 設計意図を考慮しない変更
- データ移行コストを考慮しない変更
```

## ファイル名の命名規則
- エクスポートするクラスやインターフェースと同じ名前を使用（パスカルケース）
- ファイル名は機能の責務を明確に表現する
- テストファイルは`.test.ts`を付加

```typescript
// 良い例
RoomRepository.ts        // RoomRepositoryクラスをエクスポート
GetRoomByCodeQuery.ts   // GetRoomByCodeQueryクラスをエクスポート
RoomRepository.test.ts  // RoomRepositoryのテスト

// 悪い例
room-repository.ts      // ケバブケースは使用しない
roomRepository.ts      // キャメルケースは使用しない
```

## ディレクトリ構造の遵守
- 既存のディレクトリ構造を尊重し、新しいディレクトリを作成しない
- 機能は適切なドメインディレクトリに配置する
- 例：`src/backend/domain/room`内のファイルは`src/features/room`に移動しない

## テストの実装方法
- データベースを使用するテストは`testWithDb`でラップする
- テストは実装と同時に書く
- テストケースは具体的なシナリオを記述
- モックは最小限に抑える
- テストの独立性を保つ

```typescript
// 良い例
import testWithDb from "../../test/helpers/testWithDb";

testWithDb(async (prisma) => {
  const repository = new RoomRepository(prisma);
  const room = await repository.create({ roomCode: "ABC123" });
  expect(room.roomCode).toBe("ABC123");
});

// 悪い例
describe("RoomRepository", () => {
  it("creates a room", async () => {
    const repository = new RoomRepository(prisma);  // testWithDbでラップしていない
    // ...
  });
});
``` 