import { describe, it, expect } from "vitest";
import { app } from "./app";
import { z } from "zod";

const createParticipantSchema = z.object({
  nickname: z.string().min(1, "ニックネームは必須です"),
});

describe("POST /api/participants", () => {
  it("新しい参加者を作成できる", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/participants",
      payload: {
        nickname: "テストユーザー",
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.nickname).toBe("テストユーザー");
    expect(body.sessionId).toBeDefined();
    expect(body.expiresAt).toBeDefined();
  });

  it("ニックネームが空の場合はエラーを返す", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/participants",
      payload: {
        nickname: "",
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.message).toBe("ニックネームは必須です");
  });

  it("ニックネームが指定されていない場合はエラーを返す", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/participants",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.message).toBe("ニックネームは必須です");
  });
});
