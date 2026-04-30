import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/**", "**/dist/**", "node_modules/**"] },

  ...tseslint.configs.recommended,

  {
    files: ["app/frontend/jobaggregator/src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },

  js.configs.recommended,
  {
    files: ["app/backend/**/*.js"],
    languageOptions: {
      globals: {
        require: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
      },
    },
  },
];
