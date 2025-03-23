import { beforeAll, afterAll } from "vitest";

import prisma from "../../prisma";

import type { PrismaClientType } from "../../prisma";

type TestFunc = (prisma: PrismaClientType) => Promise<void>;

export default (testFunc: TestFunc) => {
  beforeAll(async () => {
    // await truncateAll();
    // テスト用のDBを初期化
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=0`;
    const tableRows =
      await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`;
    tableRows.forEach(async (row) => {
      const table = row.TABLE_NAME;
      if (table.startsWith("_")) return;
      await prisma.$executeRawUnsafe(`DELETE FROM ${table}`);
    });

    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS=1`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  testFunc(prisma);
};
