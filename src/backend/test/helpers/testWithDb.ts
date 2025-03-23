import { beforeEach, afterAll } from "vitest";

import prisma from "../../prisma";

import type { PrismaClientType } from "../../prisma";

type TestFunc = (prisma: PrismaClientType) => Promise<void>;
type TableRow = {
  TABLE_NAME: string;
};

export default (testFunc: TestFunc): Promise<void> => {
  beforeEach(async () => {
    // テスト用のDBを初期化
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;
    const tableRows =
      await prisma.$queryRaw<TableRow[]>`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`;
    for (const row of tableRows) {
      const table = row.TABLE_NAME;
      if (table.startsWith("_")) continue;
      await prisma.$executeRawUnsafe(`DELETE FROM ${table}`);
    }
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // テストケースを実行
  return testFunc(prisma);
};
