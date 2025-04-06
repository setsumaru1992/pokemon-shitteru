import { describe, it, expect, vi } from "vitest";

import { GetRoomParticipantsQuery } from "./GetRoomParticipantsQuery";
import { RoomRepository } from "../repositories/RoomRepository";
import { Room } from "../entities/Room";
import { Participant } from "../../participant/entities/Participant";

describe("GetRoomParticipantsQuery", () => {
  it("ルームの参加者一覧を取得できる", async () => {
    // モックの設定
    const mockRoom = new Room({
      id: 1,
      code: "ABC123",
      generation: 1,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const mockParticipants = [
      new Participant({
        id: 1,
        nickname: "テストユーザー1",
        sessionId: "test-session-id-1",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }),
      new Participant({
        id: 2,
        nickname: "テストユーザー2",
        sessionId: "test-session-id-2",
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }),
    ];

    const mockRoomRepository = {
      findByCode: vi.fn().mockResolvedValue(mockRoom),
      getParticipants: vi.fn().mockResolvedValue(mockParticipants),
    } as unknown as RoomRepository;

    // クエリの実行
    const query = new GetRoomParticipantsQuery(mockRoomRepository);
    const result = await query.execute({ roomCode: "ABC123" });

    // 検証
    expect(mockRoomRepository.findByCode).toHaveBeenCalledWith("ABC123");
    expect(mockRoomRepository.getParticipants).toHaveBeenCalledWith(mockRoom);
    expect(result).toEqual(mockParticipants);
  });

  it("ルームが存在しない場合はエラーを返す", async () => {
    // モックの設定
    const mockRoomRepository = {
      findByCode: vi.fn().mockResolvedValue(null),
    } as unknown as RoomRepository;

    // クエリの実行
    const query = new GetRoomParticipantsQuery(mockRoomRepository);
    await expect(query.execute({ roomCode: "ABC123" })).rejects.toThrow(
      "ルームが見つかりません"
    );
  });

  it("ルームの有効期限が切れている場合はエラーを返す", async () => {
    // モックの設定
    const mockRoom = new Room({
      id: 1,
      code: "ABC123",
      generation: 1,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });

    const mockRoomRepository = {
      findByCode: vi.fn().mockResolvedValue(mockRoom),
    } as unknown as RoomRepository;

    // クエリの実行
    const query = new GetRoomParticipantsQuery(mockRoomRepository);
    await expect(query.execute({ roomCode: "ABC123" })).rejects.toThrow(
      "ルームの有効期限が切れています"
    );
  });
});
