import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";
import { Participant } from "../../participant/entities/Participant";
import { ParticipantRepository } from "../../participant/repositories/ParticipantRepository";
import { Room } from "../entities/Room";

import { RoomRepository } from "./RoomRepository";

describe("RoomRepository", () => {
  testWithDb(async (_) => {
    const repository = new RoomRepository();
    const participantRepository = new ParticipantRepository();

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

    describe("addParticipant", () => {
      it("ルームに参加者を追加できる", async () => {
        // ルームの作成
        const room = await repository.create({
          roomCode: "ROOM_REPOSITORY_TEST_ADD_PARTICIPANT",
          quizConfig: {},
        });

        // 参加者の作成
        const participant = await participantRepository.create({
          nickname: "テストユーザー",
          sessionId: "test-session-id",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        // 参加者の追加
        await repository.addParticipant(room, participant);

        // 参加者の追加を確認
        const updatedRoom = await repository.findByRoomCode(room.roomCode);
        expect(updatedRoom).not.toBeNull();
        if (updatedRoom) {
          const participants = await repository.getParticipants(updatedRoom);
          expect(participants).toHaveLength(1);
          expect(participants[0].id).toBe(participant.id);
        }
      });
    });

    describe("getParticipants", () => {
      it("ルームの参加者一覧を取得できる", async () => {
        // ルームの作成
        const room = await repository.create({
          roomCode: "ROOM_REPOSITORY_TEST_GET_PARTICIPANTS",
          quizConfig: {},
        });

        // 参加者の作成
        const participant1 = await participantRepository.create({
          nickname: "テストユーザー1",
          sessionId: "test-session-id-1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        const participant2 = await participantRepository.create({
          nickname: "テストユーザー2",
          sessionId: "test-session-id-2",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        // 参加者の追加
        await repository.addParticipant(room, participant1);
        await repository.addParticipant(room, participant2);

        // 参加者一覧の取得
        const participants = await repository.getParticipants(room);

        // 検証
        expect(participants).toHaveLength(2);
        expect(participants.map((p) => p.id).sort()).toEqual(
          [participant1.id, participant2.id].sort()
        );
      });
    });
  });
});
