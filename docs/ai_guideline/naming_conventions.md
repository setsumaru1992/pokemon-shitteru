# 命名規則

## 変数名
- キャメルケースを使用
- 意味のある名前を使用
- 略語は避ける
- ブール値は`is`、`has`、`can`などのプレフィックスを使用

```typescript
// 良い例
const pokemonName = 'Bulbasaur';
const isSelected = true;
const hasEvolution = true;
const canEvolve = true;

// 悪い例
const pkmn = 'Bulbasaur';  // 略語
const selected = true;     // ブール値のプレフィックスなし
```

## 関数名
- キャメルケースを使用
- 動詞で始める
- 副作用がある場合は明確に示す
- 非同期関数は`async`を明示

```typescript
// 良い例
const fetchPokemon = async (id: number): Promise<Pokemon> => {
  // ...
};

const updatePokemon = (pokemon: Pokemon): void => {
  // ...
};

// 悪い例
const pokemon = (id: number) => {  // 動詞で始まっていない
  // ...
};

const getPokemon = (id: number) => {  // 非同期関数なのにasyncがない
  // ...
};
```

## コンポーネント名
- パスカルケースを使用
- 機能を明確に示す名前を使用
- プレゼンテーショナルコンポーネントは`View`サフィックスを使用
- コンテナコンポーネントは`Container`サフィックスを使用

```typescript
// 良い例
// PokemonCard.tsx
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  // ...
};

// PokemonListView.tsx
export const PokemonListView: React.FC<PokemonListViewProps> = ({ pokemons }) => {
  // ...
};

// PokemonListContainer.tsx
export const PokemonListContainer: React.FC = () => {
  // ...
};

// 悪い例
// card.tsx
export const Card = ({ pokemon }) => {  // 機能が不明確
  // ...
};

// list.tsx
export const List = ({ items }) => {  // 機能が不明確
  // ...
};
```

## インターフェース名
- パスカルケースを使用
- `I`プレフィックスは使用しない
- 機能を明確に示す名前を使用
- Props型は`Props`サフィックスを使用

```typescript
// 良い例
interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
}

interface PokemonCardProps {
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}

// 悪い例
interface IPokemon {  // Iプレフィックス不要
  id: number;
  name: string;
  types: PokemonType[];
}

interface PokemonCard {  // Propsサフィックスなし
  pokemon: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}
```

## 型エイリアス名
- パスカルケースを使用
- `T`プレフィックスは使用しない
- 機能を明確に示す名前を使用

```typescript
// 良い例
type PokemonType = 'fire' | 'water' | 'grass';
type PokemonStatus = 'normal' | 'fainted' | 'evolved';

// 悪い例
type TPokemonType = 'fire' | 'water' | 'grass';  // Tプレフィックス不要
type Status = 'normal' | 'fainted' | 'evolved';  // 機能が不明確
```

## ファイル名
- コンポーネントファイルはパスカルケース
- ユーティリティファイルはキャメルケース
- テストファイルは`.test.ts`または`.spec.ts`サフィックスを使用
- 型定義ファイルは`.d.ts`サフィックスを使用

```
// 良い例
PokemonCard.tsx
pokemonUtils.ts
PokemonCard.test.tsx
pokemon.d.ts

// 悪い例
pokemon-card.tsx  // ケバブケース
utils.ts         // 機能が不明確
PokemonCard.spec.tsx  // テストファイルの命名規則違反
types.ts         // 型定義ファイルの命名規則違反
``` 