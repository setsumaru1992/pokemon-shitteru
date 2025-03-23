import { RoomRepository } from "../repositories/RoomRepository";

import type { Answer } from "../../../prisma/generated/client";

export class GetRoomAnswersQuery {
  private readonly roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async execute(roomCode: string): Promise<Answer[] | null> {
    const room = await this.roomRepository.findByRoomCode(roomCode);
    if (!room) {
      return null;
    }

    return this.roomRepository.findAnswersByRoomId(room.id);
  }
}
