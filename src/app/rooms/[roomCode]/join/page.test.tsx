import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import testWithDb from "@/backend/test/helpers/testWithDb";
import { useCreateParticipant } from "@/frontend/features/participants/useCreateParticipant";

import JoinRoomPage from "./page";

import type { UseCreateParticipant } from "@/frontend/features/participants/useCreateParticipant";

vi.mock("@/frontend/features/participants/useCreateParticipant", () => ({
  useCreateParticipant: vi.fn(),
}));

describe("JoinRoomPage", () => {
  testWithDb(async (_) => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should render nickname input form", () => {
      (useCreateParticipant as unknown as UseCreateParticipant).mockReturnValue(
        {
          error: "",
          participantId: "",
          isLoading: false,
          createParticipant: vi.fn(),
        }
      );
      render(<JoinRoomPage params={{ roomCode: "ABC123" }} />);
      expect(screen.getByText("ニックネームを入力")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "参加する" })
      ).toBeInTheDocument();
    });

    it("should create a participant when form is submitted with valid nickname", async () => {
      const mockResponse = { id: "1", nickname: "テストユーザー" };
      const mockCreateParticipant = vi.fn().mockResolvedValueOnce(mockResponse);
      (useCreateParticipant as unknown as UseCreateParticipant).mockReturnValue(
        {
          error: "",
          participantId: "1",
          isLoading: false,
          createParticipant: mockCreateParticipant,
        }
      );

      render(<JoinRoomPage params={{ roomCode: "ABC123" }} />);
      const input = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: "参加する" });

      fireEvent.change(input, { target: { value: "テストユーザー" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateParticipant).toHaveBeenCalledWith("テストユーザー");
        expect(screen.getByText("参加者を作成しました！")).toBeInTheDocument();
      });
    });

    it("should show error message when participant creation fails", async () => {
      const mockCreateParticipant = vi
        .fn()
        .mockRejectedValueOnce(new Error("ニックネームは必須です"));
      (useCreateParticipant as unknown as UseCreateParticipant).mockReturnValue(
        {
          error: "ニックネームは必須です",
          participantId: "",
          isLoading: false,
          createParticipant: mockCreateParticipant,
        }
      );

      render(<JoinRoomPage params={{ roomCode: "ABC123" }} />);
      const submitButton = screen.getByRole("button", { name: "参加する" });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("ニックネームは必須です")).toBeInTheDocument();
      });
    });
  });
});
