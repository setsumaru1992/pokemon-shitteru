import type { ParticipantRepository } from "../../participant/repositories/ParticipantRepository";
import type { RoomRepository } from "../repositories/RoomRepository";

interface JoinRoomCommandInput {
  roomCode: string;
  participantId: number;
}

export class JoinRoomCommand {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly participantRepository: ParticipantRepository
  ) {}

  async execute(input: JoinRoomCommandInput): Promise<void> {
    const room = await this.roomRepository.findByRoomCode(input.roomCode);
    if (!room) {
      throw new Error("ルームが見つかりません");
    }

    const participant = await this.participantRepository.findById(
      input.participantId
    );
    if (!participant) {
      throw new Error("参加者が見つかりません");
    }

    if (participant.expiresAt < new Date()) {
      throw new Error("参加者の有効期限が切れています");
    }

    await this.roomRepository.addParticipant(room, participant);
  }
}
