import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended"
  ),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScriptの厳格なチェック
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/triple-slash-reference": "off",

      // コンポーネントの命名規則
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/jsx-pascal-case": "error",
      "react/jsx-no-duplicate-props": "error",

      // インポートの順序
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // その他のコード品質ルール
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-duplicate-imports": "off",
      "import/no-duplicates": "error",
      "import/no-anonymous-default-export": "off",
      "no-unused-vars": "off", // TypeScriptのルールを使用
      "prefer-const": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/prop-types": "off", // TypeScriptを使用するため無効化
      "react/react-in-jsx-scope": "off", // Next.jsでは不要
    },
    settings: {
      "import/resolver": {
        typescript: {},
      },
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["node_modules/**", "src/backend/prisma/generated/**"],
  },
];

export default eslintConfig;
