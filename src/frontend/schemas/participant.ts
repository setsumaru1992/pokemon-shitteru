import { z } from "zod";

// 新規参加者登録フォーム
export const participantFormSchema = z.object({
  nickname: z
    .string()
    .min(1, { message: "ニックネームを入力してください" })
    .max(20, { message: "ニックネームは20文字以内で入力してください" })
    .regex(/^[^\s]+$/, {
      message: "空白文字は使用できません",
    })
    .regex(/^[a-zA-Z0-9ぁ-んァ-ン一-龯\-_]+$/, {
      message:
        "使用できる文字は英数字、ひらがな、カタカナ、漢字、ハイフン(-)、アンダースコア(_)のみです",
    }),
  use_stored_session: z.boolean().default(false), // 既存セッションを使用するかどうか
});

// セッション情報の型定義
export const sessionSchema = z.object({
  session_id: z.string(),
  nickname: z.string(),
  expires_at: z.number(), // セッション有効期限のタイムスタンプ
});

export type ParticipantFormInput = z.infer<typeof participantFormSchema>;
export type SessionData = z.infer<typeof sessionSchema>;
