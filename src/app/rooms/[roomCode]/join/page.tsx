"use client";

import { useState } from "react";

import { useCreateParticipant } from "@/frontend/features/participants/useCreateParticipant";
import { useJoinRoom } from "@/frontend/features/rooms/useJoinRoom";

import type { ReactNode } from "react";

type Props = {
  params: {
    roomCode: string;
  };
};

const JoinRoomPage = ({ params }: Props): ReactNode => {
  const [nickname, setNickname] = useState("");
  const {
    error: participantError,
    participantId,
    isLoading: isParticipantLoading,
    createParticipant,
  } = useCreateParticipant();

  const {
    error: joinError,
    isLoading: isJoinLoading,
    joinRoom,
  } = useJoinRoom();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const result = await createParticipant(nickname);
    if (result?.id) {
      await joinRoom(params.roomCode, parseInt(result.id, 10));
    }
  };

  const isLoading = isParticipantLoading || isJoinLoading;
  const error = participantError || joinError;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">ルームに参加</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700"
          >
            ニックネームを入力
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            minLength={1}
            maxLength={20}
            placeholder="ニックネームを入力（20文字以内）"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "作成中..." : "参加する"}
        </button>
      </form>

      {participantId && !joinError && (
        <div className="mt-8 p-4 bg-green-50 rounded-md">
          <h2 className="text-lg font-medium text-green-800">
            参加者を作成しました！
          </h2>
        </div>
      )}
    </div>
  );
};

export default JoinRoomPage;
