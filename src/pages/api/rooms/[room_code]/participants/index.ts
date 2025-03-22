import { NextApiRequest, NextApiResponse } from "next";
import {
  ParticipantService,
  participantSchemas,
} from "@/backend/services/participant";

const participantService = new ParticipantService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const room_code = req.query.room_code as string;
    const session_id = req.cookies.session_id;

    // セッションIDがある場合は既存参加者としてルーム参加を試みる
    if (session_id) {
      const input = { room_code, session_id };
      const validationResult = participantSchemas.joinRoom.safeParse(input);

      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation error",
          details: validationResult.error.errors,
        });
      }

      const result = await participantService.joinRoom(validationResult.data);
      return res.status(200).json(result);
    }

    // セッションIDがない場合は新規参加者として登録
    const input = { ...req.body, room_code };
    const validationResult =
      participantSchemas.createParticipant.safeParse(input);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation error",
        details: validationResult.error.errors,
      });
    }

    const result = await participantService.createParticipant(
      validationResult.data
    );

    // セッションIDをCookieに設定
    res.setHeader(
      "Set-Cookie",
      `session_id=${
        result.participant.session_id
      }; Path=/; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}`
    );

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in participant handler:", error);
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}
