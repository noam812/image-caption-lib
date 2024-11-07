import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
// Removed React plugin import since it's not needed for this project
// import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        // Disable JSX since React is not used
        ecmaFeatures: {
          jsx: false,
        },
      },
      parser: "@typescript-eslint/parser",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // Removed React plugin configuration
  // pluginReact.configs.flat.recommended,
  {
    rules: {
      // Disable the rule for disallowing 'any' types
      "@typescript-eslint/no-explicit-any": "off",

      // Adjust the rule for no unused variables
      // "warn" will show a warning without failing the build
      // "off" will disable the rule completely
      "@typescript-eslint/no-unused-vars": "warn",

      // You can add more rule customizations below as needed
      // Example:
      // "semi": ["error", "always"],
    },
  },
];
