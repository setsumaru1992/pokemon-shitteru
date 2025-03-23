import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";

import { CreateRoomCommand } from "./CreateRoomCommand";

import type { QuizConfig } from "../types";

testWithDb(async (prisma) => {
  describe("CreateRoomCommand", () => {
    it("should create a room with valid generation id", async () => {
      const command = new CreateRoomCommand();
      const room = await command.execute({ generationId: "1" });

      // ルームが作成されていることを確認
      expect(room.id).toBeDefined();
      expect(room.roomCode).toMatch(/^[A-Z0-9]{6}$/);
      expect(room.createdAt).toBeDefined();

      const quizConfig = JSON.parse(room.quizConfig as string) as QuizConfig;
      expect(quizConfig.generation).toBe(1);

      // DBに保存されていることを確認
      const savedRoom = await prisma.room.findUnique({
        where: { roomCode: room.roomCode },
      });
      expect(savedRoom).toBeDefined();
      const savedQuizConfig = JSON.parse(
        savedRoom?.quizConfig as string
      ) as QuizConfig;
      expect(savedQuizConfig.generation).toBe(1);
      expect(savedRoom?.roomCode).toBe(room.roomCode);
    });

    it("should generate unique room codes", async () => {
      const command = new CreateRoomCommand();
      const room1 = await command.execute({ generationId: "1" });
      const room2 = await command.execute({ generationId: "1" });

      expect(room1.roomCode).not.toBe(room2.roomCode);
    });

    it("should handle concurrent room creation", async () => {
      const command = new CreateRoomCommand();
      const rooms = await Promise.all([
        command.execute({ generationId: "1" }),
        command.execute({ generationId: "1" }),
        command.execute({ generationId: "1" }),
      ]);

      const roomCodes = rooms.map(
        (room: { roomCode: string }) => room.roomCode
      );
      const uniqueRoomCodes = new Set(roomCodes);
      expect(uniqueRoomCodes.size).toBe(rooms.length);
    });

    it("should throw error when generation id is invalid", async () => {
      const command = new CreateRoomCommand();
      await expect(command.execute({ generationId: "0" })).rejects.toThrow(
        "指定された世代が見つかりません"
      );
      await expect(command.execute({ generationId: "10" })).rejects.toThrow(
        "指定された世代が見つかりません"
      );
      await expect(command.execute({ generationId: "abc" })).rejects.toThrow(
        "指定された世代が見つかりません"
      );
    });
  });
});
