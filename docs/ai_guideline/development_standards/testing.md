# テスト

## テストファースト開発
- テストを先に書く
- テストケースは具体的なシナリオを記述
- テストは独立して実行可能
- テストは再現可能

```typescript
// 良い例
describe('Room', () => {
  it('should create a room with valid parameters', () => {
    const room = new Room({
      name: 'test-room',
      maxPlayers: 4,
      hostId: 'user1'
    });
    expect(room.name).toBe('test-room');
    expect(room.maxPlayers).toBe(4);
    expect(room.hostId).toBe('user1');
    expect(room.players).toHaveLength(1);
  });

  it('should throw error when creating room with invalid parameters', () => {
    expect(() => {
      new Room({
        name: '',  // 空の名前
        maxPlayers: 4,
        hostId: 'user1'
      });
    }).toThrow('ルーム名は必須です');
  });
});

// 悪い例
describe('Room', () => {
  it('should work', () => {  // テストの意図が不明確
    const room = new Room({});
    // アサーションなし
  });
});
```

## バックエンドテスト
- ユニットテスト
- 統合テスト
- E2Eテスト
- テストデータの管理

```typescript
// 良い例
describe('RoomService', () => {
  let roomService: RoomService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    roomService = new RoomService(prisma);
  });

  afterEach(async () => {
    await prisma.room.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a room and add host as player', async () => {
    const room = await roomService.createRoom({
      name: 'test-room',
      maxPlayers: 4,
      hostId: 'user1'
    });

    expect(room).toBeDefined();
    expect(room.name).toBe('test-room');
    expect(room.players).toHaveLength(1);
    expect(room.players[0].userId).toBe('user1');
  });

  it('should join a room when not full', async () => {
    const room = await roomService.createRoom({
      name: 'test-room',
      maxPlayers: 4,
      hostId: 'user1'
    });

    await roomService.joinRoom(room.id, 'user2');

    const updatedRoom = await roomService.getRoom(room.id);
    expect(updatedRoom.players).toHaveLength(2);
    expect(updatedRoom.players[1].userId).toBe('user2');
  });
});

// 悪い例
describe('RoomService', () => {
  it('should handle room operations', async () => {  // テストの意図が不明確
    const roomService = new RoomService(new PrismaClient());
    // テストデータのクリーンアップなし
    // アサーションなし
  });
});
```

## フロントエンドテスト
- コンポーネントテスト
- フックテスト
- ユーティリティ関数テスト
- イベントハンドラテスト

```typescript
// 良い例
describe('PokemonCard', () => {
  const mockPokemon = {
    id: 1,
    name: 'Bulbasaur',
    types: ['grass', 'poison']
  };

  it('should render pokemon information correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} onSelect={jest.fn()} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<PokemonCard pokemon={mockPokemon} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockPokemon);
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

## テスト実行のタイミング
- コミット前
- CI/CDパイプライン
- デプロイ前
- 定期的な実行

```yaml
# 良い例
name: CI

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
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

# 悪い例
name: CI

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test  # テストの種類が不明確
```

## テストの品質管理
- テストカバレッジの確認
- テストの可読性
- テストの保守性
- テストの実行速度

```typescript
// 良い例
// テストヘルパー関数の作成
const createMockPokemon = (overrides = {}): Pokemon => ({
  id: 1,
  name: 'Bulbasaur',
  types: ['grass', 'poison'],
  ...overrides
});

describe('PokemonList', () => {
  it('should filter pokemons by type', () => {
    const pokemons = [
      createMockPokemon({ types: ['fire'] }),
      createMockPokemon({ types: ['water'] }),
      createMockPokemon({ types: ['grass'] })
    ];

    render(<PokemonList pokemons={pokemons} />);
    
    fireEvent.click(screen.getByText('ほのお'));
    expect(screen.getByText('Bulbasaur')).not.toBeInTheDocument();
  });
});

// 悪い例
describe('PokemonList', () => {
  it('should filter pokemons', () => {  // テストの意図が不明確
    const pokemons = [
      { id: 1, name: 'Bulbasaur', types: ['fire'] },
      { id: 2, name: 'Squirtle', types: ['water'] },
      { id: 3, name: 'Charmander', types: ['grass'] }
    ];
    // テストデータの作成が重複
    // アサーションなし
  });
});
```

## テスト対象の判断基準
- ビジネスロジック
- ユーザーインタラクション
- エラーケース
- エッジケース

```typescript
// 良い例
describe('RoomService', () => {
  it('should handle room full error', async () => {
    const room = await roomService.createRoom({
      name: 'test-room',
      maxPlayers: 2,
      hostId: 'user1'
    });

    await roomService.joinRoom(room.id, 'user2');
    
    await expect(
      roomService.joinRoom(room.id, 'user3')
    ).rejects.toThrow('ルームが満員です');
  });

  it('should handle duplicate player error', async () => {
    const room = await roomService.createRoom({
      name: 'test-room',
      maxPlayers: 4,
      hostId: 'user1'
    });

    await expect(
      roomService.joinRoom(room.id, 'user1')
    ).rejects.toThrow('既に参加しています');
  });
});

// 悪い例
describe('RoomService', () => {
  it('should handle errors', async () => {  // エラーの種類が不明確
    const roomService = new RoomService(new PrismaClient());
    // エラーケースのテストなし
  });
});
``` 