import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useJoinRoom } from "./useJoinRoom";

describe("useJoinRoom", () => {
  it("should join a room successfully", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useJoinRoom());

    await act(async () => {
      await result.current.joinRoom("ABC123", 1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/rooms/ABC123/participants/1",
      {
        method: "POST",
      }
    );
    expect(result.current.error).toBe("");
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle room not found error", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: "ルームが見つかりません" }),
    });

    const { result } = renderHook(() => useJoinRoom());

    await act(async () => {
      await result.current.joinRoom("NONEXISTENT", 1);
    });

    expect(result.current.error).toBe("ルームが見つかりません");
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle participant not found error", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: "参加者が見つかりません" }),
    });

    const { result } = renderHook(() => useJoinRoom());

    await act(async () => {
      await result.current.joinRoom("ABC123", 999);
    });

    expect(result.current.error).toBe("参加者が見つかりません");
    expect(result.current.isLoading).toBe(false);
  });
});
