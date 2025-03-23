import { describe, it, expect, beforeAll, afterAll } from "vitest";

import { prisma } from "../../../../prisma/prisma";
import { CreateRoomCommand } from "../CreateRoomCommand";

import type { QuizConfig } from "../../types";

describe("CreateRoomCommand", () => {
  beforeAll(async () => {
    // // テスト用のDBを初期化
    // await prisma.$executeRaw`PRAGMA foreign_keys = OFF`;
    // await prisma.$executeRaw`DELETE FROM rooms`;
    // await prisma.$executeRaw`DELETE FROM participants`;
    // await prisma.$executeRaw`DELETE FROM room_participants`;
    // await prisma.$executeRaw`DELETE FROM answers`;
    // await prisma.$executeRaw`DELETE FROM pokemons`;
    // await prisma.$executeRaw`DELETE FROM generations`;
    // await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a room with generation 1", async () => {
    const command = new CreateRoomCommand(prisma);
    const room = await command.execute();

    // ルームが作成されていることを確認
    expect(room.id).toBeDefined();
    expect(room.roomCode).toMatch(/^[A-Z0-9]{8}$/);
    expect(room.createdAt).toBeDefined();

    const quizConfig = JSON.parse(room.quizConfig as string) as QuizConfig;
    expect(quizConfig.generation).toBe(1);

    // DBに保存されていることを確認
    const savedRoom = await prisma.room.findUnique({
      where: { id: room.id },
    });
    expect(savedRoom).toBeDefined();
    const savedQuizConfig = JSON.parse(
      savedRoom?.quizConfig as string
    ) as QuizConfig;
    expect(savedQuizConfig.generation).toBe(1);
    expect(savedRoom?.roomCode).toBe(room.roomCode);
  });

  it("should generate unique room codes", async () => {
    const command = new CreateRoomCommand(prisma);
    const room1 = await command.execute();
    const room2 = await command.execute();

    expect(room1.roomCode).not.toBe(room2.roomCode);
  });

  it("should handle concurrent room creation", async () => {
    const command = new CreateRoomCommand(prisma);
    const rooms = await Promise.all([
      command.execute(),
      command.execute(),
      command.execute(),
    ]);

    const roomCodes = rooms.map((room) => room.roomCode);
    const uniqueRoomCodes = new Set(roomCodes);
    expect(uniqueRoomCodes.size).toBe(rooms.length);
  });
});
