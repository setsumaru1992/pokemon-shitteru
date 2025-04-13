import { describe, beforeEach, afterAll } from "vitest";

import prisma from "../../prisma";

import type { PrismaClientType } from "../../prisma";

type TableRow = {
  TABLE_NAME: string;
};

const cleanUpDb = async (prisma: PrismaClientType) => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;
  const tableRows = await prisma.$queryRaw<
    TableRow[]
  >`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`;
  for (const row of tableRows) {
    const table = row.TABLE_NAME;
    if (table.startsWith("_")) continue;
    await prisma.$executeRawUnsafe(`DELETE FROM ${table}`);
  }
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;
};

export default async (
  testFunc: (prisma: PrismaClientType) => Promise<void>
): Promise<void> => {
  describe("test with DB", async () => {
    beforeEach(async () => {
      // テスト用のDBを初期化
      await cleanUpDb(prisma);
      return async (): Promise<void> => {
        await cleanUpDb(prisma);
      };
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    // テストケースを実行
    await testFunc(prisma);
  });
};
