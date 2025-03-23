import { describe, it, expect, vi } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";

import { CreateParticipantCommand } from "./CreateParticipantCommand";
import { ParticipantRepository } from "../repositories/ParticipantRepository";

describe("CreateParticipantCommand", () => {
  testWithDb(async (_) => {
    const repository = new ParticipantRepository();
    const command = new CreateParticipantCommand(repository);

    describe("execute", () => {
      it("新しい参加者を作成できる", async () => {
        const result = await command.execute({
          nickname: "テストユーザー",
        });

        expect(result.nickname).toBe("テストユーザー");
        expect(result.sessionId).toBeDefined();
        expect(result.expiresAt).toBeDefined();
      });

      it("ニックネームが空の場合はエラーを返す", async () => {
        await expect(
          command.execute({
            nickname: "",
          })
        ).rejects.toThrow("ニックネームは必須です");
      });
    });
  });
});
