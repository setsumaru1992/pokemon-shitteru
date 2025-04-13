import { useState } from "react";

import { createParticipant } from "@/frontend/api/participants";

export type UseCreateParticipant = {
  error: string;
  participantId: string;
  isLoading: boolean;
  createParticipant: (nickname: string) => Promise<void>;
};

export function useCreateParticipant(): UseCreateParticipant {
  const [error, setError] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateParticipant = async (nickname: string) => {
    setError("");
    setParticipantId("");
    setIsLoading(true);

    try {
      const response = await createParticipant(nickname);
      setParticipantId(response.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "参加者の作成に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    participantId,
    isLoading,
    createParticipant: handleCreateParticipant,
  };
}
