"use client";

import { useState } from "react";

import { useCreateRoom } from "@/frontend/features/rooms/useCreateRoom";

import type { ReactNode } from "react";

const NewRoomPage = (): ReactNode => {
  const [generationId, setGenerationId] = useState("");
  const { error, roomCode, isLoading, createRoom } = useCreateRoom();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await createRoom(generationId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">ルームを作成</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="generation"
            className="block text-sm font-medium text-gray-700"
          >
            世代を選択
          </label>
          <select
            id="generation"
            value={generationId}
            onChange={(e) => setGenerationId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">選択してください</option>
            <option value="1">第1世代</option>
            <option value="2">第2世代</option>
            <option value="3">第3世代</option>
            <option value="4">第4世代</option>
            <option value="5">第5世代</option>
            <option value="6">第6世代</option>
            <option value="7">第7世代</option>
            <option value="8">第8世代</option>
            <option value="9">第9世代</option>
          </select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "作成中..." : "ルームを作成"}
        </button>
      </form>

      {roomCode && (
        <div className="mt-8 p-4 bg-green-50 rounded-md">
          <h2 className="text-lg font-medium text-green-800 mb-2">
            ルームを作成しました！
          </h2>
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-700">参加用URL</p>
            <p className="text-sm text-green-600 break-all">
              {`http://localhost:3000/rooms/${roomCode}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewRoomPage;