import { v4 as uuidv4 } from "uuid";

import type { Participant } from "../../../prisma/generated/client";
import type { ParticipantRepository } from "../repositories/ParticipantRepository";

export class CreateParticipantCommand {
  constructor(private repository: ParticipantRepository) {}

  async execute(params: { nickname: string }): Promise<Participant> {
    if (!params.nickname) {
      throw new Error("ニックネームは必須です");
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

    return this.repository.create({
      nickname: params.nickname,
      sessionId: uuidv4(),
      expiresAt,
    });
  }
}
