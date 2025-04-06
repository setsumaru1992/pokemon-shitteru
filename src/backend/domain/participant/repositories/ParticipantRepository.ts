import prisma from "../../../prisma";

import type { Participant, Prisma } from "../../../prisma/generated/client";

export class ParticipantRepository {
  async create(data: Prisma.ParticipantCreateInput): Promise<Participant> {
    return prisma.participant.create({
      data,
    });
  }

  async findById(id: number): Promise<Participant | null> {
    return prisma.participant.findUnique({
      where: { id },
    });
  }

  async findBySessionId(sessionId: string): Promise<Participant | null> {
    return prisma.participant.findUnique({
      where: { sessionId },
    });
  }

  async findByRoomId(roomId: number): Promise<Participant[]> {
    return prisma.participant.findMany({
      where: {
        rooms: {
          some: {
            roomId,
          },
        },
      },
    });
  }
}
