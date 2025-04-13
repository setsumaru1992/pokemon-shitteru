import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";
import { ParticipantRepository } from "../../participant/repositories/ParticipantRepository";
import { RoomRepository } from "../repositories/RoomRepository";

import { GetRoomParticipantsQuery } from "./GetRoomParticipantsQuery";

describe("GetRoomParticipantsQuery", async () => {
  await testWithDb(async (_) => {
    const roomRepository = new RoomRepository();
    const participantRepository = new ParticipantRepository();
    const query = new GetRoomParticipantsQuery(roomRepository);

    it("ルームの参加者一覧を取得できる", async () => {
      // ルームの作成
      const room = await roomRepository.create({
        roomCode: "ABC123",
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

      // ルームに参加者を追加
      await roomRepository.addParticipant(room, participant1);
      await roomRepository.addParticipant(room, participant2);

      // クエリの実行
      const result = await query.execute({ roomCode: "ABC123" });

      // 検証
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.nickname)).toContain("テストユーザー1");
      expect(result.map((p) => p.nickname)).toContain("テストユーザー2");
    });

    it("ルームが存在しない場合はエラーを返す", async () => {
      // クエリの実行
      await expect(query.execute({ roomCode: "NONEXISTENT" })).rejects.toThrow(
        "ルームが見つかりません"
      );
    });
  });
});
