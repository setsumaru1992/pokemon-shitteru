import { NextRequest } from "next/server";
import { describe, it, expect, vi } from "vitest";

import { ParticipantRepository } from "@/backend/domain/participant/repositories/ParticipantRepository";
import { JoinRoomCommand } from "@/backend/domain/room/commands/JoinRoomCommand";
import { RoomRepository } from "@/backend/domain/room/repositories/RoomRepository";
import testWithDb from "@/backend/test/helpers/testWithDb";

import { POST } from "./route";

// モックの作成
vi.mock("@/backend/domain/room/commands/JoinRoomCommand");
vi.mock("@/backend/domain/room/repositories/RoomRepository");
vi.mock("@/backend/domain/participant/repositories/ParticipantRepository");

describe("POST /api/rooms/[roomCode]/participants/[participantId]", () => {
  testWithDb(async (_) => {
    it("ルームに参加できる", async () => {
      // モックの設定
      const mockRoomRepository = new RoomRepository();
      const mockParticipantRepository = new ParticipantRepository();
      const _mockCommand = new JoinRoomCommand(
        mockRoomRepository,
        mockParticipantRepository
      );

      vi.mocked(JoinRoomCommand.prototype.execute).mockResolvedValue(undefined);

      // リクエストの作成
      const request = new NextRequest(
        "http://localhost:3000/api/rooms/ABC123/participants/1",
        {
          method: "POST",
        }
      );

      // APIの呼び出し
      const response = await POST(request, {
        params: {
          roomCode: "ABC123",
          participantId: "1",
        },
      });

      // レスポンスの検証
      expect(response.status).toBe(200);
      expect(JoinRoomCommand.prototype.execute).toHaveBeenCalledWith({
        roomCode: "ABC123",
        participantId: 1,
      });
    });

    it("ルームが存在しない場合はエラーを返す", async () => {
      // モックの設定
      const mockRoomRepository = new RoomRepository();
      const mockParticipantRepository = new ParticipantRepository();
      const _mockCommand = new JoinRoomCommand(
        mockRoomRepository,
        mockParticipantRepository
      );

      vi.mocked(JoinRoomCommand.prototype.execute).mockRejectedValue(
        new Error("ルームが見つかりません")
      );

      // リクエストの作成
      const request = new NextRequest(
        "http://localhost:3000/api/rooms/NONEXISTENT/participants/1",
        {
          method: "POST",
        }
      );

      // APIの呼び出し
      const response = await POST(request, {
        params: {
          roomCode: "NONEXISTENT",
          participantId: "1",
        },
      });
      const data = await response.json();

      // レスポンスの検証
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "ルームが見つかりません" });
    });

    it("参加者が存在しない場合はエラーを返す", async () => {
      // モックの設定
      const mockRoomRepository = new RoomRepository();
      const mockParticipantRepository = new ParticipantRepository();
      const _mockCommand = new JoinRoomCommand(
        mockRoomRepository,
        mockParticipantRepository
      );

      vi.mocked(JoinRoomCommand.prototype.execute).mockRejectedValue(
        new Error("参加者が見つかりません")
      );

      // リクエストの作成
      const request = new NextRequest(
        "http://localhost:3000/api/rooms/ABC123/participants/999",
        {
          method: "POST",
        }
      );

      // APIの呼び出し
      const response = await POST(request, {
        params: {
          roomCode: "ABC123",
          participantId: "999",
        },
      });
      const data = await response.json();

      // レスポンスの検証
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: "参加者が見つかりません" });
    });

    it("ルームの有効期限が切れている場合はエラーを返す", async () => {
      // モックの設定
      const mockRoomRepository = new RoomRepository();
      const mockParticipantRepository = new ParticipantRepository();
      const _mockCommand = new JoinRoomCommand(
        mockRoomRepository,
        mockParticipantRepository
      );

      vi.mocked(JoinRoomCommand.prototype.execute).mockRejectedValue(
        new Error("ルームの有効期限が切れています")
      );

      // リクエストの作成
      const request = new NextRequest(
        "http://localhost:3000/api/rooms/ABC123/participants/1",
        {
          method: "POST",
        }
      );

      // APIの呼び出し
      const response = await POST(request, {
        params: {
          roomCode: "ABC123",
          participantId: "1",
        },
      });
      const data = await response.json();

      // レスポンスの検証
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: "ルームの有効期限が切れています" });
    });
  });
});
