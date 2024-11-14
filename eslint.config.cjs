// eslint.config.cjs

const globals = require("globals");
const tsEslintPlugin = require("@typescript-eslint/eslint-plugin");
const eslintPluginReact = require("eslint-plugin-react");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], // Specify the file types to lint
    languageOptions: {
      globals: { ...globals.node }, // Define global variables
      parser: require("@typescript-eslint/parser"), // Specify the parser
      parserOptions: {
        ecmaVersion: 2021, // Specify ECMAScript version
        sourceType: "module", // Specify module type
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin, // Register TypeScript ESLint plugin
      react: eslintPluginReact, // Register React ESLint plugin
    },
    rules: {
      // Core ESLint rules
      "no-console": "warn",
      "no-unused-vars": "warn",

      // TypeScript ESLint rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // React-specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Add more rules as needed
    },
  },
];
