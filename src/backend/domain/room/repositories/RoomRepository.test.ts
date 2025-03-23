import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";

import { RoomRepository } from "./RoomRepository";

describe("RoomRepository", () => {
  testWithDb(async (_) => {
    const repository = new RoomRepository();

    describe("create", () => {
      it("新しいルームを作成できる", async () => {
        const roomCode = "ROOM_REPOSITORY_TEST_CREATE";
        const result = await repository.create({
          roomCode,
          quizConfig: {},
        });

        expect(result.roomCode).toBe(roomCode);
        expect(result.quizConfig).toEqual({});
      });
    });

    describe("findByRoomCode", () => {
      it("ルームコードからルームを取得できる", async () => {
        const room = await repository.create({
          roomCode: "ABC456",
          quizConfig: {},
        });

        const result = await repository.findByRoomCode("ABC456");

        expect(result).toEqual(room);
      });

      it("存在しないルームコードの場合はnullを返す", async () => {
        const result = await repository.findByRoomCode("NONEXISTENT");

        expect(result).toBeNull();
      });
    });
  });
});
