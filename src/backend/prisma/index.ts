import { PrismaClient } from "./generated/client";

import type { LogLevel } from "./generated/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const logLevels: LogLevel[] = ((): LogLevel[] => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "test"
  ) {
    return ["error", "warn"];
  }
  return ["query", "error", "warn"];
})();

const prisma =
  global.prisma ||
  new PrismaClient({
    log: logLevels,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export type PrismaClientType = PrismaClient;

export default prisma;