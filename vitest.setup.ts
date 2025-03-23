import "@testing-library/jest-dom";
import { vi } from "vitest";

// Reactの開発版を使用
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    __esModule: true,
    default: actual.default,
    act: (callback: () => void) => callback(),
  };
});

// Next.js navigation mockの設定
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));
