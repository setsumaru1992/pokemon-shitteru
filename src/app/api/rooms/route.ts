import { NextResponse } from "next/server";
import { z } from "zod";

import { CreateRoomCommand } from "@/backend/domain/room/commands/CreateRoomCommand";

const createRoomSchema = z.object({
  generationId: z.string({
    required_error: "generationIdは必須です",
  }),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { generationId } = createRoomSchema.parse(body);
    const command = new CreateRoomCommand();
    const room = await command.execute({ generationId });
    return NextResponse.json(room);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }
    if (
      error instanceof Error &&
      error.message === "指定された世代が見つかりません"
    ) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    throw error;
  }
}
