import prisma from "../../../prisma";

import type {
  Room,
  Answer,
  Prisma,
  Participant,
} from "../../../prisma/generated/client";

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

  async addParticipant(room: Room, participant: Participant): Promise<void> {
    await prisma.roomParticipant.create({
      data: {
        roomId: room.id,
        participantId: participant.id,
      },
    });
  }

  async getParticipants(room: Room): Promise<Participant[]> {
    const roomParticipants = await prisma.roomParticipant.findMany({
      where: { roomId: room.id },
      include: {
        participant: true,
      },
    });

    return roomParticipants.map((rp) => rp.participant);
  }
}
