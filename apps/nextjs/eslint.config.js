import baseConfig, { restrictEnvAccess } from "@jv-recipes/eslint-config/base";
import nextjsConfig from "@jv-recipes/eslint-config/nextjs";
import reactConfig from "@jv-recipes/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
