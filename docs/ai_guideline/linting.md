# Lintとコード品質管理

## 基本方針
- ESLint: JavaScriptとTypeScriptのコード品質チェック
- Prettier: コードフォーマット
- TypeScript: 厳格な型チェック

## TypeScriptの厳格な型チェック
- `strict: true`を有効化
- `any`型の使用を禁止
- 明示的な戻り値の型定義を必須化
- ジェネリック型の活用を推奨

```typescript
// 良い例
const fetchPokemon = async (id: number): Promise<Pokemon> => {
  const response = await fetch(`/api/pokemon/${id}`);
  return response.json();
};

// 悪い例
const fetchPokemon = async (id) => {  // 型定義なし
  const response = await fetch(`/api/pokemon/${id}`);
  return response.json();
};
```

## コンポーネントの命名規則
- Pascalケースを使用（例：`PokemonCard.tsx`）
- ファイル名とコンポーネント名を一致させる
- 機能を明確に示す名前を使用

```typescript
// 良い例
// PokemonCard.tsx
export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    // ...
  );
};

// 悪い例
// card.tsx
export const Card = (props) => {  // 機能が不明確
  return (
    // ...
  );
};
```

## importの順序
1. 外部ライブラリ
2. 内部モジュール
3. スタイル関連

```typescript
// 良い例
import { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
import { PokemonCard } from '@/components/PokemonCard';
import './PokemonList.css';

// 悪い例
import './PokemonList.css';
import { PokemonCard } from '@/components/PokemonCard';
import { useState, useEffect } from 'react';
import { Pokemon } from '@/types/pokemon';
```

## コードフォーマット
- セミコロン必須
- シングルクォート使用
- インデント2スペース
- 行の最大長: 100文字

```typescript
// 良い例
const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  
  useEffect(() => {
    fetchPokemons();
  }, []);
  
  return (
    <div className="pokemon-list">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

// 悪い例
const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  useEffect(() => {
    fetchPokemons();
  }, []);
  return (
    <div className="pokemon-list">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
```

## 推奨VSCode拡張機能
- ESLint: コード品質チェック
- Prettier: コードフォーマット
- TypeScript Import Sorter: importの自動ソート
- Error Lens: エラーの可視化
- GitLens: Git履歴の表示

## 設定ファイル
必要な設定ファイルは以下の場所に配置してください：

```
.
├── .eslintrc.yml      # ESLintの設定
├── .eslintignore      # ESLintの対象外ファイル
├── .prettierrc.json   # Prettierの設定
└── .prettierignore    # Prettierの対象外ファイル
``` 