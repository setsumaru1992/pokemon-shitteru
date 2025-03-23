import { useState } from "react";
import { createRoom, CreateRoomResponse } from "@/frontend/api/rooms";

export function useCreateRoom() {
  const [error, setError] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (generationId: string) => {
    setError("");
    setRoomCode("");
    setIsLoading(true);

    try {
      const response = await createRoom(generationId);
      setRoomCode(response.roomCode);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ルームの作成に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    roomCode,
    isLoading,
    createRoom: handleCreateRoom,
  };
}
