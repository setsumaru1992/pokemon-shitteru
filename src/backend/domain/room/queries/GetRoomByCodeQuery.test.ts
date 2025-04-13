import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";
import { RoomRepository } from "../repositories/RoomRepository";

import { GetRoomByCodeQuery } from "./GetRoomByCodeQuery";

describe("GetRoomByCodeQuery", async () => {
  testWithDb(async (_) => {
    const roomRepository = new RoomRepository();
    const query = new GetRoomByCodeQuery(roomRepository);

    it("ルームコードからルームを取得できる", async () => {
      const room = await roomRepository.create({
        roomCode: "ABC123",
        quizConfig: {},
      });

      const result = await query.execute("ABC123");

      expect(result).toEqual(room);
    });

    it("存在しないルームコードの場合はnullを返す", async () => {
      const result = await query.execute("NONEXISTENT");

      expect(result).toBeNull();
    });
  });
});
