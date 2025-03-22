import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const prisma = new PrismaClient();

// Input Schemas
const createParticipantSchema = z.object({
  room_code: z
    .string()
    .min(1, "ルームコードは必須です")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "ルームコードは英数字、ハイフン、アンダースコアのみ使用可能です"
    ),
  nickname: z
    .string()
    .min(1, "ニックネームは必須です")
    .max(20, "ニックネームは20文字以内で入力してください")
    .regex(/^[^\s]+$/, "ニックネームに空白は使用できません"),
  session_id: z.string().optional(), // 新規作成時は不要（自動生成）
});

const joinRoomSchema = z.object({
  room_code: z
    .string()
    .min(1, "ルームコードは必須です")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "ルームコードは英数字、ハイフン、アンダースコアのみ使用可能です"
    ),
  session_id: z.string(),
});

// Types
type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
type JoinRoomInput = z.infer<typeof joinRoomSchema>;

export class ParticipantService {
  // セッションの有効期限（24時間）
  private static SESSION_DURATION_HOURS = 24;

  // 新規参加者の作成とルームへの参加
  async createParticipant(input: CreateParticipantInput) {
    // 入力値のバリデーション
    const validationResult = createParticipantSchema.safeParse(input);
    if (!validationResult.success) {
      throw new Error(
        "入力値が不正です: " + JSON.stringify(validationResult.error.errors)
      );
    }

    const session_id = input.session_id || uuidv4();
    const expires_at = new Date(Date.now() + this.getSessionDurationMs());

    // トランザクションで参加者の作成とルームへの参加を行う
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // ルームの存在確認
        const room = await tx.room.findUnique({
          where: { room_code: input.room_code },
        });
        if (!room) {
          throw new Error("指定されたルームが存在しません");
        }

        // 参加者の作成
        const participant = await tx.participant.create({
          data: {
            nickname: input.nickname,
            session_id,
            expires_at,
          },
        });

        // ルームへの参加
        await tx.roomParticipant.create({
          data: {
            room_id: room.id,
            participant_id: participant.id,
          },
        });

        return {
          participant,
          room,
        };
      }
    );

    return result;
  }

  // 既存参加者のルームへの参加
  async joinRoom(input: JoinRoomInput) {
    // 入力値のバリデーション
    const validationResult = joinRoomSchema.safeParse(input);
    if (!validationResult.success) {
      throw new Error(
        "入力値が不正です: " + JSON.stringify(validationResult.error.errors)
      );
    }

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 参加者の存在確認
      const participant = await tx.participant.findUnique({
        where: { session_id: input.session_id },
      });
      if (!participant) {
        throw new Error("セッションが無効です");
      }

      // セッションの有効期限確認
      if (participant.expires_at < new Date()) {
        throw new Error("セッションの有効期限が切れています");
      }

      // ルームの存在確認
      const room = await tx.room.findUnique({
        where: { room_code: input.room_code },
      });
      if (!room) {
        throw new Error("指定されたルームが存在しません");
      }

      // 既に参加済みかチェック
      const existingParticipation = await tx.roomParticipant.findUnique({
        where: {
          room_id_participant_id: {
            room_id: room.id,
            participant_id: participant.id,
          },
        },
      });
      if (existingParticipation) {
        throw new Error("既にこのルームに参加しています");
      }

      // ルームへの参加
      await tx.roomParticipant.create({
        data: {
          room_id: room.id,
          participant_id: participant.id,
        },
      });

      // セッションの有効期限を更新
      await tx.participant.update({
        where: { id: participant.id },
        data: {
          expires_at: new Date(Date.now() + this.getSessionDurationMs()),
        },
      });

      return {
        participant,
        room,
      };
    });
  }

  // セッションの有効性確認
  async validateSession(session_id: string) {
    const participant = await prisma.participant.findUnique({
      where: { session_id },
    });

    if (!participant) {
      return null;
    }

    if (participant.expires_at < new Date()) {
      return null;
    }

    return participant;
  }

  private getSessionDurationMs() {
    return ParticipantService.SESSION_DURATION_HOURS * 60 * 60 * 1000;
  }
}

// Export schemas and types for API layer
export const participantSchemas = {
  createParticipant: createParticipantSchema,
  joinRoom: joinRoomSchema,
} as const;
