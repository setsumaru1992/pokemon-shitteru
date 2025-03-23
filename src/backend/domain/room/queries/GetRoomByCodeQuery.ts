import type { Room } from "../../../prisma/generated/client";
import type { RoomRepository } from "../repositories/RoomRepository";

export class GetRoomByCodeQuery {
  constructor(private readonly roomRepository: RoomRepository) {}

  async execute(code: string): Promise<Room | null> {
    return this.roomRepository.findByRoomCode(code);
  }
}
