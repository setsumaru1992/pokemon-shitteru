import { describe, it, expect, vi } from "vitest";

import { Participant } from "../../participant/entities/Participant";
import { Room } from "../entities/Room";

import { JoinRoomCommand } from "./JoinRoomCommand";

import type { ParticipantRepository } from "../../participant/repositories/ParticipantRepository";
import type { RoomRepository } from "../repositories/RoomRepository";

describe("JoinRoomCommand", () => {
  const mockRoomRepository = {
    findByRoomCode: vi.fn(),
    addParticipant: vi.fn(),
  } as unknown as RoomRepository;

  const mockParticipantRepository = {
    findById: vi.fn(),
  } as unknown as ParticipantRepository;

  const command = new JoinRoomCommand(
    mockRoomRepository,
    mockParticipantRepository
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("参加者をルームに追加できる", async () => {
    const mockRoom = {
      id: 1,
      roomCode: "ABC123",
      quizConfig: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockParticipant = {
      id: 1,
      nickname: "テストユーザー",
      sessionId: "test-session-id",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    mockRoomRepository.findByRoomCode.mockResolvedValue(mockRoom);
    mockParticipantRepository.findById.mockResolvedValue(mockParticipant);

    await command.execute({
      roomCode: "ABC123",
      participantId: 1,
    });

    expect(mockRoomRepository.findByRoomCode).toHaveBeenCalledWith("ABC123");
    expect(mockParticipantRepository.findById).toHaveBeenCalledWith(1);
    expect(mockRoomRepository.addParticipant).toHaveBeenCalledWith(
      mockRoom,
      mockParticipant
    );
  });

  it("ルームが存在しない場合はエラーを返す", async () => {
    mockRoomRepository.findByRoomCode.mockResolvedValue(null);

    await expect(
      command.execute({
        roomCode: "NONEXISTENT",
        participantId: 1,
      })
    ).rejects.toThrow("ルームが見つかりません");
  });

  it("参加者が存在しない場合はエラーを返す", async () => {
    const mockRoom = {
      id: 1,
      roomCode: "ABC123",
      quizConfig: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRoomRepository.findByRoomCode.mockResolvedValue(mockRoom);
    mockParticipantRepository.findById.mockResolvedValue(null);

    await expect(
      command.execute({
        roomCode: "ABC123",
        participantId: 999,
      })
    ).rejects.toThrow("参加者が見つかりません");
  });

  it("参加者の有効期限が切れている場合はエラーを返す", async () => {
    const mockRoom = {
      id: 1,
      roomCode: "ABC123",
      quizConfig: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockParticipant = {
      id: 1,
      nickname: "テストユーザー",
      sessionId: "test-session-id",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 1000), // 有効期限切れ
    };

    mockRoomRepository.findByRoomCode.mockResolvedValue(mockRoom);
    mockParticipantRepository.findById.mockResolvedValue(mockParticipant);

    await expect(
      command.execute({
        roomCode: "ABC123",
        participantId: 1,
      })
    ).rejects.toThrow("参加者の有効期限が切れています");
  });
});
