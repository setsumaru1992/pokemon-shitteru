import { RoomRepository } from "../repositories/RoomRepository";
import { Participant } from "../../participant/entities/Participant";

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

    // ルームの有効期限チェック
    if (room.expiresAt < new Date()) {
      throw new Error("ルームの有効期限が切れています");
    }

    // 参加者一覧の取得
    return this.roomRepository.getParticipants(room);
  }
}
