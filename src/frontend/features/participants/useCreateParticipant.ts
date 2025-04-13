import { useState } from "react";

import { createParticipant } from "@/frontend/api/participants";

type CreateParticipantResponse = {
  id: string;
  nickname: string;
};

export type UseCreateParticipant = {
  error: string;
  participantId: string;
  isLoading: boolean;
  createParticipant: (
    nickname: string
  ) => Promise<CreateParticipantResponse | undefined>;
};

export function useCreateParticipant(): UseCreateParticipant {
  const [error, setError] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateParticipant = async (
    nickname: string
  ): Promise<CreateParticipantResponse | undefined> => {
    setError("");
    setParticipantId("");
    setIsLoading(true);

    try {
      const response = await createParticipant(nickname);
      setParticipantId(response.id);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "参加者の作成に失敗しました"
      );
      return undefined;
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
