import { NextRequest } from "next/server";
import { describe, it, expect } from "vitest";

import testWithDb from "@/backend/test/helpers/testWithDb";

import { POST } from "./route";

describe("POST /api/rooms", () => {
  testWithDb(async (_) => {
    it("should create a room with valid parameters", async () => {
      const request = new NextRequest("http://localhost:3000/api/rooms", {
        method: "POST",
        body: JSON.stringify({
          generationId: "1",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty("roomCode");
      expect(body).toHaveProperty("id");
      expect(body.roomCode).toMatch(/^[A-Z0-9]{6}$/);
    });

    it("should return 400 when generationId is not provided", async () => {
      const request = new NextRequest("http://localhost:3000/api/rooms", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.message).toBe("generationIdは必須です");
    });

    it("should return 404 when generation does not exist", async () => {
      const request = new NextRequest("http://localhost:3000/api/rooms", {
        method: "POST",
        body: JSON.stringify({
          generationId: "999",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body.message).toBe("指定された世代が見つかりません");
    });
  });
});
