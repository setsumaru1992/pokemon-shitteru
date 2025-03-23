import { customAlphabet } from "nanoid";

import { RoomRepository } from "../repositories/RoomRepository";

import type { Room } from "../../../prisma/generated/client";
import type { QuizConfig } from "../types";

export class CreateRoomCommand {
  private readonly generateRoomCode: () => string;
  private readonly repository: RoomRepository;

  constructor() {
    // 大文字英数字のみを使用してランダムな6文字を生成
    this.generateRoomCode = customAlphabet(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      6
    );
    this.repository = new RoomRepository();
  }

  async execute(params: { generationId: string }): Promise<Room> {
    const maxRetries = 3;
    let retryCount = 0;

    // 世代IDのバリデーション
    const generationId = parseInt(params.generationId);
    if (isNaN(generationId) || generationId < 1 || generationId > 9) {
      throw new Error("指定された世代が見つかりません");
    }

    const quizConfig: QuizConfig = {
      generation: generationId,
    };

    while (retryCount < maxRetries) {
      const roomCode = this.generateRoomCode();

      try {
        // ルームの作成を試みる
        return await this.repository.create({
          roomCode,
          quizConfig: JSON.stringify(quizConfig),
        });
      } catch (error: unknown) {
        // ユニーク制約違反の場合はリトライ
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "P2002" &&
          retryCount < maxRetries - 1
        ) {
          retryCount++;
          continue;
        }
        throw error;
      }
    }

    throw new Error("Failed to generate unique room code");
  }
}
