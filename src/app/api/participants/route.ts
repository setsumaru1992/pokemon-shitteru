import { NextRequest, NextResponse } from "next/server";

import { CreateParticipantCommand } from "../../../backend/domain/participant/commands/CreateParticipantCommand";
import { ParticipantRepository } from "../../../backend/domain/participant/repositories/ParticipantRepository";

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの解析
    const body = await request.json();
    const { nickname } = body;

    // バリデーション
    if (!nickname || typeof nickname !== "string" || nickname.trim() === "") {
      return NextResponse.json(
        { error: "ニックネームは必須です" },
        { status: 400 }
      );
    }

    // 参加者の作成
    const repository = new ParticipantRepository();
    const command = new CreateParticipantCommand(repository);
    const participant = await command.execute({ nickname });

    // レスポンスの返却
    return NextResponse.json({
      id: participant.id,
      nickname: participant.nickname,
      sessionId: participant.sessionId,
      createdAt: participant.createdAt.toISOString(),
      expiresAt: participant.expiresAt.toISOString(),
    });
  } catch (error) {
    // エラーハンドリング
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "参加者の作成に失敗しました" },
      { status: 500 }
    );
  }
}
