# セキュリティ

## 一般的なセキュリティ
- 最新のセキュリティパッチを適用
- 依存関係の脆弱性を定期的にチェック
- セキュアな通信プロトコルを使用
- エラーメッセージは適切に制御

```typescript
// 良い例
// エラーメッセージの制御
try {
  await createRoom(roomData);
} catch (error) {
  if (error instanceof ValidationError) {
    // ユーザーに表示するエラーメッセージ
    setError('入力内容を確認してください');
  } else {
    // システムエラーはログに記録
    console.error('Failed to create room:', error);
    setError('予期せぬエラーが発生しました');
  }
}

// 悪い例
try {
  await createRoom(roomData);
} catch (error) {
  // エラーの詳細をそのまま表示
  setError(error.message);
}
```

## 入力バリデーション
- すべてのユーザー入力を検証
- SQLインジェクション対策
- XSS対策
- CSRF対策

```typescript
// 良い例
// バックエンドでの入力バリデーション
const createRoomSchema = z.object({
  name: z.string()
    .min(3, 'ルーム名は3文字以上で入力してください')
    .max(50, 'ルーム名は50文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ルーム名は英数字、ハイフン、アンダースコアのみ使用できます'),
  maxPlayers: z.number()
    .min(2, 'プレイヤー数は2人以上にしてください')
    .max(8, 'プレイヤー数は8人以下にしてください'),
});

// フロントエンドでの入力バリデーション
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const result = createRoomSchema.safeParse(formData);
  if (!result.success) {
    setErrors(result.error.errors);
    return;
  }
  // 処理を続行
};

// 悪い例
// バリデーションなし
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await createRoom(formData);  // 入力値の検証なし
};
```

## 認証・認可
- JWTの適切な管理
- セッション管理
- 権限チェック
- パスワードの安全な管理

```typescript
// 良い例
// 認証ミドルウェア
const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('認証が必要です');
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError('無効なトークンです'));
  }
};

// 権限チェック
const checkPermission = (requiredRole: Role) => {
  return (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    if (req.user.role !== requiredRole) {
      next(new ForbiddenError('権限がありません'));
      return;
    }
    next();
  };
};

// 悪い例
// 認証チェックなし
const createRoom = async (req: NextApiRequest, res: NextApiResponse) => {
  const roomData = req.body;
  await prisma.room.create({ data: roomData });
  res.json({ success: true });
};
```

## データ保護
- 機密情報の暗号化
- 個人情報の適切な取り扱い
- バックアップの管理
- ログの適切な管理

```typescript
// 良い例
// 機密情報の暗号化
const encryptSensitiveData = (data: string): string => {
  const key = process.env.ENCRYPTION_KEY;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
};

// ログの適切な管理
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...meta
    }));
  },
  error: (error: Error, meta?: object) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message,
      stack: error.stack,
      ...meta
    }));
  }
};

// 悪い例
// 機密情報の平文保存
const saveUserData = async (userData: UserData) => {
  await prisma.user.create({
    data: {
      ...userData,
      password: userData.password  // 暗号化なし
    }
  });
};
```

## セキュリティヘッダー
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

```typescript
// 良い例
// Next.jsのセキュリティヘッダー設定
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
];

export const config = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};

// 悪い例
// セキュリティヘッダーなし
export const config = {
  // セキュリティヘッダーの設定なし
};
``` 