import { PrismaClient } from "../../../prisma/generated/client";

const prisma = new PrismaClient();

export class ParticipantRepository {
  async create(params: {
    nickname: string;
    sessionId: string;
    expiresAt: Date;
  }) {
    return prisma.participant.create({
      data: {
        nickname: params.nickname,
        sessionId: params.sessionId,
        expiresAt: params.expiresAt,
      },
    });
  }

  async findById(id: number) {
    return prisma.participant.findUnique({
      where: {
        id,
      },
    });
  }

  async findBySessionId(sessionId: string) {
    return prisma.participant.findUnique({
      where: {
        sessionId,
      },
    });
  }
}
