import prisma from "../../../prisma";

import type { Room, Answer, Prisma } from "../../../prisma/generated/client";

export class RoomRepository {
  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    return prisma.room.create({
      data,
    });
  }

  async findByRoomCode(roomCode: string): Promise<Room | null> {
    return prisma.room.findUnique({
      where: { roomCode },
    });
  }

  async findAnswersByRoomId(roomId: number): Promise<Answer[]> {
    return prisma.answer.findMany({
      where: { roomId },
      include: {
        participant: true,
        pokemon: true,
      },
    });
  }
}
