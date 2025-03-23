import { describe, it, expect } from "vitest";

import testWithDb from "../../../../test/helpers/testWithDb";
import { RoomRepository } from "../RoomRepository";

testWithDb(async (_) => {
  describe("RoomRepository", () => {
    it("should create a room", async () => {
      const repository = new RoomRepository();
      const room = await repository.create({
        roomCode: "TEST1234",
        quizConfig: JSON.stringify({ generation: 1 }),
      });

      expect(room.id).toBeDefined();
      expect(room.roomCode).toBe("TEST1234");
      expect(room.createdAt).toBeDefined();
    });

    it("should find a room by room code", async () => {
      const repository = new RoomRepository();
      const createdRoom = await repository.create({
        roomCode: "TEST5678",
        quizConfig: JSON.stringify({ generation: 1 }),
      });

      const foundRoom = await repository.findByRoomCode("TEST5678");
      expect(foundRoom).toBeDefined();
      expect(foundRoom?.id).toBe(createdRoom.id);
    });

    it("should return null when room is not found", async () => {
      const repository = new RoomRepository();
      const room = await repository.findByRoomCode("NONEXIST");
      expect(room).toBeNull();
    });
  });
});
