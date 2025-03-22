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