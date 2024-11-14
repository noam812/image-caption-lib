// eslint.config.js

const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
// Removed React plugin import since it's not needed for this project
// const pluginReact = require("eslint-plugin-react");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
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
  tseslint.configs.recommended,
  // Removed React plugin configuration
  // pluginReact.configs.recommended,
  {
    rules: {
      // Disable the rule for disallowing 'any' types
      "@typescript-eslint/no-explicit-any": "off",

      // Adjust the rule for no unused variables
      "@typescript-eslint/no-unused-vars": "warn",

      // You can add more rule customizations below as needed
      // Example:
      // "semi": ["error", "always"],
    },
  },
];
