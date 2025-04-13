import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";
import { ParticipantRepository } from "../../participant/repositories/ParticipantRepository";
import { RoomRepository } from "../repositories/RoomRepository";

import { JoinRoomCommand } from "./JoinRoomCommand";

describe("JoinRoomCommand", () => {
  testWithDb(async (_) => {
    const roomRepository = new RoomRepository();
    const participantRepository = new ParticipantRepository();
    const command = new JoinRoomCommand(roomRepository, participantRepository);

    it("参加者をルームに追加できる", async () => {
      // ルームの作成
      const room = await roomRepository.create({
        roomCode: "ABC123",
        quizConfig: {},
      });

      // 参加者の作成
      const participant = await participantRepository.create({
        nickname: "テストユーザー",
        sessionId: "test-session-id",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // コマンドの実行
      await command.execute({
        roomCode: "ABC123",
        participantId: participant.id,
      });

      // 検証：参加者がルームに追加されたことを確認
      const participants = await roomRepository.getParticipants(room);
      expect(participants).toHaveLength(1);
      expect(participants[0].id).toBe(participant.id);
    });

    it("ルームが存在しない場合はエラーを返す", async () => {
      // 参加者の作成
      const participant = await participantRepository.create({
        nickname: "テストユーザー",
        sessionId: "test-session-id-2",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // コマンドの実行
      await expect(
        command.execute({
          roomCode: "NONEXISTENT",
          participantId: participant.id,
        })
      ).rejects.toThrow("ルームが見つかりません");
    });

    it("参加者が存在しない場合はエラーを返す", async () => {
      // ルームの作成
      await roomRepository.create({
        roomCode: "ABC123",
        quizConfig: {},
      });

      // コマンドの実行
      await expect(
        command.execute({
          roomCode: "ABC123",
          participantId: 999,
        })
      ).rejects.toThrow("参加者が見つかりません");
    });

    it("参加者の有効期限が切れている場合はエラーを返す", async () => {
      // ルームの作成
      await roomRepository.create({
        roomCode: "ABC123",
        quizConfig: {},
      });

      // 有効期限切れの参加者を作成
      const participant = await participantRepository.create({
        nickname: "テストユーザー",
        sessionId: "test-session-id-3",
        expiresAt: new Date(Date.now() - 1000), // 有効期限切れ
      });

      // コマンドの実行
      await expect(
        command.execute({
          roomCode: "ABC123",
          participantId: participant.id,
        })
      ).rejects.toThrow("参加者の有効期限が切れています");
    });
  });
});
