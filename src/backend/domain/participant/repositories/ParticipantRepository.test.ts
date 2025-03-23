import { describe, it, expect } from "vitest";

import testWithDb from "../../../test/helpers/testWithDb";

import { ParticipantRepository } from "./ParticipantRepository";

describe("ParticipantRepository", () => {
  testWithDb(async (_) => {
    const repository = new ParticipantRepository();

    describe("create", () => {
      it("新しい参加者を作成できる", async () => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

        const result = await repository.create({
          nickname: "テストユーザー",
          sessionId: "test-session-id",
          expiresAt,
        });

        expect(result.nickname).toBe("テストユーザー");
        expect(result.sessionId).toBe("test-session-id");
        expect(result.expiresAt).toEqual(expiresAt);
      });
    });

    describe("findById", () => {
      it("IDから参加者を取得できる", async () => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

        const participant = await repository.create({
          nickname: "テストユーザー",
          sessionId: "test-session-id",
          expiresAt,
        });

        const result = await repository.findById(participant.id);

        expect(result).toEqual(participant);
      });

      it("存在しないIDの場合はnullを返す", async () => {
        const result = await repository.findById(999);

        expect(result).toBeNull();
      });
    });

    describe("findBySessionId", () => {
      it("セッションIDから参加者を取得できる", async () => {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

        const participant = await repository.create({
          nickname: "テストユーザー",
          sessionId: "test-session-id",
          expiresAt,
        });

        const result = await repository.findBySessionId("test-session-id");

        expect(result).toEqual(participant);
      });

      it("存在しないセッションIDの場合はnullを返す", async () => {
        const result = await repository.findBySessionId("non-existent-session");

        expect(result).toBeNull();
      });
    });
  });
});
