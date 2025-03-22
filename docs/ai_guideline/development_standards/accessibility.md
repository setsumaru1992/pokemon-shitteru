# アクセシビリティ

## 基本ルール
- セマンティックなHTML要素を使用
- 適切な見出しレベルを使用
- 色だけでなく、テキストでも情報を伝える
- キーボード操作をサポート

```typescript
// 良い例
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <article className="pokemon-card">
      <h2 className="pokemon-name">{pokemon.name}</h2>
      <div className="pokemon-types" role="list">
        {pokemon.types.map(type => (
          <span key={type} role="listitem" className={`type-${type}`}>
            {type}
          </span>
        ))}
      </div>
      <button
        onClick={() => onSelect(pokemon)}
        aria-label={`${pokemon.name}を選択`}
      >
        選択
      </button>
    </article>
  );
};

// 悪い例
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="pokemon-card">
      <div className="pokemon-name">{pokemon.name}</div>
      <div className="pokemon-types">
        {pokemon.types.map(type => (
          <span key={type} className={`type-${type}`} />
        ))}
      </div>
      <div onClick={() => onSelect(pokemon)}>選択</div>
    </div>
  );
};
```

## WAI-ARIA
- 適切なARIAラベルを使用
- ロールを適切に設定
- 状態を適切に管理
- ライブリージョンを活用

```typescript
// 良い例
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <div role="region" aria-label="ポケモン一覧">
      <div
        role="list"
        aria-label="選択可能なポケモン"
        onKeyDown={handleKeyDown}
      >
        {pokemons.map(pokemon => (
          <div
            key={pokemon.id}
            role="listitem"
            aria-selected={selectedPokemon?.id === pokemon.id}
            tabIndex={0}
            onClick={() => setSelectedPokemon(pokemon)}
          >
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>
      {selectedPokemon && (
        <div
          role="alert"
          aria-live="polite"
        >
          {selectedPokemon.name}が選択されました
        </div>
      )}
    </div>
  );
};

// 悪い例
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  return (
    <div>
      {pokemons.map(pokemon => (
        <div key={pokemon.id}>
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
};
```

## フォーム
- ラベルを適切に設定
- エラーメッセージを適切に表示
- 必須項目を明示
- 入力支援を提供

```typescript
// 良い例
const CreateRoomForm: React.FC = () => {
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="roomName">ルーム名</label>
        <input
          id="roomName"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.roomName}
          aria-describedby={errors.roomName ? 'roomNameError' : undefined}
        />
        {errors.roomName && (
          <div id="roomNameError" role="alert">
            {errors.roomName.message}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="maxPlayers">最大プレイヤー数</label>
        <input
          id="maxPlayers"
          type="number"
          min="2"
          max="8"
          aria-required="true"
          aria-invalid={!!errors.maxPlayers}
          aria-describedby={errors.maxPlayers ? 'maxPlayersError' : undefined}
        />
        {errors.maxPlayers && (
          <div id="maxPlayersError" role="alert">
            {errors.maxPlayers.message}
          </div>
        )}
      </div>
      <button type="submit">作成</button>
    </form>
  );
};

// 悪い例
const CreateRoomForm: React.FC = () => {
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="ルーム名" />
      <input type="number" placeholder="最大プレイヤー数" />
      <button type="submit">作成</button>
    </form>
  );
};
```

## キーボード操作
- フォーカス可能な要素を適切に設定
- フォーカス順序を適切に管理
- ショートカットキーを提供
- スキップリンクを実装

```typescript
// 良い例
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        メインコンテンツへスキップ
      </a>
      <nav>
        <button
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter('fire')}
          aria-pressed={filter === 'fire'}
        >
          ほのお
        </button>
      </nav>
      <main id="main-content">
        <div
          role="list"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {filteredPokemons.map(pokemon => (
            <div
              key={pokemon.id}
              role="listitem"
              tabIndex={0}
              onClick={() => handleSelect(pokemon)}
            >
              <PokemonCard pokemon={pokemon} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

// 悪い例
const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  return (
    <div>
      {pokemons.map(pokemon => (
        <div key={pokemon.id}>
          <PokemonCard pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
};
```

## テスト
- アクセシビリティテストを実施
- スクリーンリーダーでの動作確認
- キーボード操作の確認
- コントラスト比の確認

```typescript
// 良い例
describe('PokemonCard', () => {
  it('should be accessible', () => {
    const pokemon = {
      id: 1,
      name: 'Bulbasaur',
      types: ['grass', 'poison']
    };
    render(<PokemonCard pokemon={pokemon} onSelect={jest.fn()} />);
    
    // セマンティックな要素の確認
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument();
    
    // キーボード操作の確認
    const card = screen.getByRole('article');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(pokemon);
    
    // ARIA属性の確認
    expect(screen.getByRole('list')).toHaveAttribute('aria-label', '選択可能なポケモン');
  });
});

// 悪い例
describe('PokemonCard', () => {
  it('should render correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} onSelect={jest.fn()} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });
});
``` 