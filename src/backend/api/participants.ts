import { FastifyInstance } from "fastify";
import { z } from "zod";

import { CreateParticipantCommand } from "../domain/participant/commands/CreateParticipantCommand";
import { ParticipantRepository } from "../domain/participant/repositories/ParticipantRepository";

const createParticipantSchema = z.object({
  nickname: z
    .string({
      required_error: "ニックネームは必須です",
    })
    .min(1, "ニックネームは必須です"),
});

export async function participantRoutes(app: FastifyInstance) {
  const repository = new ParticipantRepository();
  const createCommand = new CreateParticipantCommand(repository);

  app.post("/api/participants", async (request, reply) => {
    try {
      const body = createParticipantSchema.parse(request.body);
      const participant = await createCommand.execute(body);
      return participant;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          message: error.errors[0].message,
        });
        return;
      }
      throw error;
    }
  });
}
