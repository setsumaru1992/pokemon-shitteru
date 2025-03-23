import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useCreateRoom } from "@/frontend/features/rooms/useCreateRoom";

import NewRoomPage from "./page";

import type { UseCreateRoom } from "@/frontend/features/rooms/useCreateRoom";

vi.mock("@/frontend/features/rooms/useCreateRoom", () => ({
  useCreateRoom: vi.fn(),
}));

describe("NewRoomPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render generation selection form", () => {
    (useCreateRoom as unknown as UseCreateRoom).mockReturnValue({
      error: null,
      roomCode: null,
      isLoading: false,
      createRoom: vi.fn(),
    });
    render(<NewRoomPage />);
    expect(screen.getByText("世代を選択")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ルームを作成" })
    ).toBeInTheDocument();
  });

  it("should create a room when form is submitted with valid generation", async () => {
    const mockResponse = { roomCode: "ABC123", id: "1" };
    const mockCreateRoom = vi.fn().mockResolvedValueOnce(mockResponse);
    (useCreateRoom as unknown as UseCreateRoom).mockReturnValue({
      error: null,
      roomCode: "ABC123",
      isLoading: false,
      createRoom: mockCreateRoom,
    });

    render(<NewRoomPage />);
    const select = screen.getByRole("combobox");
    const submitButton = screen.getByRole("button", { name: "ルームを作成" });

    fireEvent.change(select, { target: { value: "1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("ルームを作成しました！")).toBeInTheDocument();
      expect(screen.getByText("参加用URL")).toBeInTheDocument();
      expect(
        screen.getByText(/http:\/\/localhost:3000\/rooms\/ABC123/)
      ).toBeInTheDocument();
    });
  });

  it("should show error message when room creation fails", async () => {
    const mockCreateRoom = vi
      .fn()
      .mockRejectedValueOnce(new Error("世代が選択されていません"));
    (useCreateRoom as unknown as UseCreateRoom).mockReturnValue({
      error: "世代が選択されていません",
      roomCode: null,
      isLoading: false,
      createRoom: mockCreateRoom,
    });

    render(<NewRoomPage />);
    const submitButton = screen.getByRole("button", { name: "ルームを作成" });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("世代が選択されていません")).toBeInTheDocument();
    });
  });
});
