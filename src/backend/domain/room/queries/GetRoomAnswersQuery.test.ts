import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";

import { GetRoomAnswersQuery } from "./GetRoomAnswersQuery";

import type { PrismaClientType } from "../../../prisma";

testWithDb(async (prisma: PrismaClientType) => {
  describe("GetRoomAnswersQuery", () => {
    it("should return empty array when room has no answers", async () => {
      const room = await prisma.room.create({
        data: {
          roomCode: "TEST1234",
          quizConfig: JSON.stringify({ generation: 1 }),
        },
      });

      const query = new GetRoomAnswersQuery();
      const answers = await query.execute(room.roomCode);

      expect(answers).toEqual([]);
    });

    it("should return answers for a room", async () => {
      // テストデータをトランザクション内で作成
      const { room, answer } = await prisma.$transaction(async (tx) => {
        const room = await tx.room.create({
          data: {
            roomCode: "TEST5678",
            quizConfig: JSON.stringify({ generation: 1 }),
          },
        });

        const participant = await tx.participant.create({
          data: {
            nickname: "test_user",
            sessionId: "test_session",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24時間後
          },
        });

        // 参加者をルームに追加
        await tx.roomParticipant.create({
          data: {
            roomId: room.id,
            participantId: participant.id,
          },
        });

        const generation = await tx.generation.create({
          data: {
            label: "第1世代",
            globalDexStart: 1,
            globalDexEnd: 151,
          },
        });

        const pokemon = await tx.pokemon.create({
          data: {
            name: "ピカチュウ",
            globalDexNo: 25,
            generationId: generation.id,
          },
        });

        const answer = await tx.answer.create({
          data: {
            roomId: room.id,
            participantId: participant.id,
            pokemonId: pokemon.id,
            userAnswer: "ピカチュウ",
            isCorrect: true,
            answeredAt: new Date(),
          },
        });

        return { room, answer };
      });

      const query = new GetRoomAnswersQuery();
      const answers = await query.execute(room.roomCode);

      expect(answers).not.toBeNull();
      if (answers) {
        expect(answers).toHaveLength(1);
        expect(answers[0]).toMatchObject({
          id: answer.id,
          userAnswer: "ピカチュウ",
          isCorrect: true,
        });
      }
    });

    it("should return null when room does not exist", async () => {
      const query = new GetRoomAnswersQuery();
      const answers = await query.execute("NOTEXIST");

      expect(answers).toBeNull();
    });
  });
});
