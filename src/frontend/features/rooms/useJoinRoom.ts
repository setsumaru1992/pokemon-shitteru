import { useState } from "react";

export const useJoinRoom = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const joinRoom = async (roomCode: string, participantId: number) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/rooms/${roomCode}/participants/${participantId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }
    } catch (e) {
      setError("予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    joinRoom,
  };
};
