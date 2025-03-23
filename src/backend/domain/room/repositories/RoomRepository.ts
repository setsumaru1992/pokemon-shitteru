import prisma from "../../../prisma";

import type { Room } from "../../../prisma/generated/client";

export class RoomRepository {
  async create(
    data: Omit<Room, "id" | "createdAt" | "updatedAt">
  ): Promise<Room> {
    return prisma.room.create({
      data,
    });
  }

  async findByRoomCode(roomCode: string): Promise<Room | null> {
    return prisma.room.findUnique({
      where: { roomCode },
    });
  }
}
