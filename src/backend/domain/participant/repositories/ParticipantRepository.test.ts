import { describe, it, expect } from "vitest";

import prisma from "../../../prisma";
import testWithDb from "../../../test/helpers/testWithDb";

import { ParticipantRepository } from "./ParticipantRepository";

describe("ParticipantRepository", () => {
  testWithDb(async (_) => {
    const repository = new ParticipantRepository();

    describe("create", () => {
      it("新しい参加者を作成できる", async () => {
        const nickname = "テストユーザー";
        const sessionId = "test-session-id";
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

        const result = await repository.create({
          nickname,
          sessionId,
          expiresAt,
        });

        expect(result.nickname).toBe(nickname);
        expect(result.sessionId).toBe(sessionId);
        expect(result.expiresAt).toEqual(expiresAt);
      });
    });

    describe("findById", () => {
      it("IDから参加者を取得できる", async () => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

        const participant = await repository.create({
          nickname: "テストユーザー",
          sessionId: "test-session-id",
          expiresAt,
        });

        const result = await repository.findById(participant.id);

        expect(result).toEqual(participant);
      });

      it("存在しないIDの場合はnullを返す", async () => {
        const result = await repository.findById(999);

        expect(result).toBeNull();
      });
    });

    describe("findBySessionId", () => {
      it("セッションIDから参加者を取得できる", async () => {
        const participant = await repository.create({
          nickname: "テストユーザー",
          sessionId: "test-session-id",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        const result = await repository.findBySessionId("test-session-id");

        expect(result).toEqual(participant);
      });

      it("存在しないセッションIDの場合はnullを返す", async () => {
        const result = await repository.findBySessionId(
          "non-existent-session-id"
        );

        expect(result).toBeNull();
      });
    });

    describe("findByRoomId", () => {
      it("ルームIDから参加者一覧を取得できる", async () => {
        // ルームを作成
        const room = await prisma.room.create({
          data: {
            roomCode: "TEST_ROOM",
            quizConfig: {},
          },
        });

        // 参加者を作成
        const participant1 = await repository.create({
          nickname: "テストユーザー1",
          sessionId: "test-session-id-1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        const participant2 = await repository.create({
          nickname: "テストユーザー2",
          sessionId: "test-session-id-2",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        // ルーム参加情報を作成
        await prisma.roomParticipant.createMany({
          data: [
            {
              roomId: room.id,
              participantId: participant1.id,
            },
            {
              roomId: room.id,
              participantId: participant2.id,
            },
          ],
        });

        const result = await repository.findByRoomId(room.id);

        expect(result).toHaveLength(2);
        expect(result.map((p: { id: number }) => p.id).sort()).toEqual(
          [participant1.id, participant2.id].sort()
        );
      });

      it("参加者がいないルームの場合は空配列を返す", async () => {
        // ルームを作成
        const room = await prisma.room.create({
          data: {
            roomCode: "EMPTY_ROOM",
            quizConfig: {},
          },
        });

        const result = await repository.findByRoomId(room.id);

        expect(result).toHaveLength(0);
      });
    });
  });
});
