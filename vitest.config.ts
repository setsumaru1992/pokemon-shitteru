import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    deps: {
      inline: [/@testing-library\/react/],
    },
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
    pool: "forks", // デフォルト
    poolOptions: {
      forks: {
        singleFork: true, // 並列実行するとDBで他のテストデータが干渉するため基本は逐次実行
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
