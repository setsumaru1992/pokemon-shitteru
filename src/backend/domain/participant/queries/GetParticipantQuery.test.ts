import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";

import { GetParticipantQuery } from "./GetParticipantQuery";
import { ParticipantRepository } from "../repositories/ParticipantRepository";
import { CreateParticipantCommand } from "../commands/CreateParticipantCommand";

describe("GetParticipantQuery", () => {
  testWithDb(async (_) => {
    const repository = new ParticipantRepository();
    const createCommand = new CreateParticipantCommand(repository);
    const query = new GetParticipantQuery(repository);

    describe("execute", () => {
      it("セッションIDから参加者を取得できる", async () => {
        const participant = await createCommand.execute({
          nickname: "テストユーザー",
        });

        const result = await query.execute({
          sessionId: participant.sessionId,
        });

        expect(result).toEqual(participant);
      });

      it("存在しないセッションIDの場合はnullを返す", async () => {
        const result = await query.execute({
          sessionId: "non-existent-session",
        });

        expect(result).toBeNull();
      });
    });
  });
});
