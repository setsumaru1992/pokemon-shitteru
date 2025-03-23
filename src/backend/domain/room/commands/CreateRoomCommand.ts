import { customAlphabet } from "nanoid";

import { prisma } from "@/backend/prisma/prisma";

import type { QuizConfig } from "../types";
import type { Room } from "@/backend/prisma/generated/client";

export class CreateRoomCommand {
  private readonly generateRoomCode: () => string;

  constructor() {
    // 大文字英数字のみを使用してランダムな8文字を生成
    this.generateRoomCode = customAlphabet(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      8
    );
  }

  async execute(): Promise<Room> {
    const maxRetries = 3;
    let retryCount = 0;

    const quizConfig: QuizConfig = {
      generation: 1,
    };

    while (retryCount < maxRetries) {
      const roomCode = this.generateRoomCode();

      try {
        // ルームの作成を試みる
        const room = await prisma.room.create({
          data: {
            roomCode,
            quizConfig: JSON.stringify(quizConfig),
          },
        });

        return room;
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
