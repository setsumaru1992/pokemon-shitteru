import type { Participant } from "../../../prisma/generated/client";
import type { RoomRepository } from "../repositories/RoomRepository";

interface GetRoomParticipantsQueryInput {
  roomCode: string;
}

export class GetRoomParticipantsQuery {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(input: GetRoomParticipantsQueryInput): Promise<Participant[]> {
    const { roomCode } = input;

    // ルームの取得
    const room = await this.roomRepository.findByRoomCode(roomCode);
    if (!room) {
      throw new Error("ルームが見つかりません");
    }

    // 参加者一覧の取得
    return this.roomRepository.getParticipants(room);
  }
}
