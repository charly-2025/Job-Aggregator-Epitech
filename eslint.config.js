import js from "@eslint/js";

export default [
  { ignores: ["dist/**", "**/dist/**", "node_modules/**"] },

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
