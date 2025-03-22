import { z } from "zod";

export const createRoomSchema = z.object({
  quiz_config: z.object({
    generations: z.array(z.number().int().positive()).min(1),
    mode: z.enum(["fill-all"]),
    time_limit: z.number().int().positive().nullable(),
  }),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
