import { ParticipantRepository } from "../repositories/ParticipantRepository";

export class GetParticipantQuery {
  constructor(private repository: ParticipantRepository) {}

  async execute(params: { sessionId: string }) {
    return this.repository.findBySessionId(params.sessionId);
  }
}
