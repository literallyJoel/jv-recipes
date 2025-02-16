import baseConfig from "@jv-recipes/eslint-config/base";
import reactConfig from "@jv-recipes/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
