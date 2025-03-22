# パフォーマンス最適化

## レンダリング最適化
- 不要な再レンダリングを防ぐ
- `useMemo`と`useCallback`を適切に使用
- 大きなリストは仮想化する
- 画像は最適化する

```typescript
// 良い例
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  const sortedPokemons = useMemo(() => {
    return [...pokemons].sort((a, b) => a.name.localeCompare(b.name));
  }, [pokemons]);

  const handleSelect = useCallback((pokemon: Pokemon) => {
    // 選択処理
  }, []);

  return (
    <VirtualizedList
      height={400}
      itemCount={sortedPokemons.length}
      itemSize={50}
    >
      {({ index, style }) => (
        <PokemonCard
          key={sortedPokemons[index].id}
          pokemon={sortedPokemons[index]}
          onSelect={handleSelect}
          style={style}
        />
      )}
    </VirtualizedList>
  );
};

// 悪い例
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  const sortedPokemons = [...pokemons].sort((a, b) => a.name.localeCompare(b.name));  // 毎回再計算

  const handleSelect = (pokemon: Pokemon) => {  // 毎回再生成
    // 選択処理
  };

  return (
    <div>
      {sortedPokemons.map(pokemon => (  // 仮想化なし
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};
```

## データ取得
- キャッシュを活用する
- 必要なデータのみを取得する
- ページネーションを実装する
- バックグラウンドでデータを更新する

```typescript
// 良い例
const PokemonList: React.FC = () => {
  const { data, isLoading, error } = useQuery<Pokemon[]>(
    'pokemons',
    () => fetchPokemons(),
    {
      staleTime: 5 * 60 * 1000,  // 5分間キャッシュ
      keepPreviousData: true,    // ページネーション時のちらつき防止
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={fetchMorePokemons}
      hasMore={hasMore}
    >
      {data.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </InfiniteScroll>
  );
};

// 悪い例
const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPokemons();
      setPokemons(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);  // キャッシュなし、ページネーションなし

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {pokemons.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
```

## 画像最適化
- Next.jsの`Image`コンポーネントを使用
- 適切なサイズとフォーマットを選択
- 遅延読み込みを実装
- プレースホルダーを表示

```typescript
// 良い例
const PokemonImage: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  return (
    <Image
      src={`/pokemon/${pokemon.id}.png`}
      alt={pokemon.name}
      width={96}
      height={96}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    />
  );
};

// 悪い例
const PokemonImage: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  return (
    <img
      src={`/pokemon/${pokemon.id}.png`}
      alt={pokemon.name}
      width={96}
      height={96}
    />  // 最適化なし
  );
};
```

## バンドルサイズ最適化
- コード分割を実装
- 不要な依存関係を削除
- 動的インポートを使用
- ツリーシェイキングを活用

```typescript
// 良い例
const PokemonDetails = dynamic(() => import('./PokemonDetails'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// 悪い例
import PokemonDetails from './PokemonDetails';  // 常にバンドルに含まれる
```

## メモリ管理
- メモリリークを防ぐ
- 大きなオブジェクトは適切に解放
- イベントリスナーは適切に解除
- 不要な状態は保持しない

```typescript
// 良い例
useEffect(() => {
  const handleScroll = () => {
    // スクロール処理
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// 悪い例
useEffect(() => {
  window.addEventListener('scroll', () => {
    // スクロール処理
  });  // イベントリスナーが解除されない
}, []);
``` 