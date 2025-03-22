import { z } from "zod";

export const createRoomFormSchema = z.object({
  generations: z
    .array(z.number().int().positive())
    .min(1, { message: "少なくとも1つの世代を選択してください" }),
  mode: z.enum(["fill-all"], {
    errorMap: () => ({ message: "無効なモードが選択されています" }),
  }),
  time_limit: z
    .union([
      z.number().int().positive(),
      z.literal(""), // フォームの空入力を許可
    ])
    .transform((val) => (val === "" ? null : val))
    .refine((val) => val === null || val > 0, {
      message: "制限時間は空欄か正の整数を入力してください",
    }),
});

export type CreateRoomFormInput = z.infer<typeof createRoomFormSchema>;
