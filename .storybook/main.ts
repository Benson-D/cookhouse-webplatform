import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  // Scoped to src/common/ only, deliberately — module-local components
  // (modules/<domain>/components/) don't get stories here.
  "stories": [
    "../src/common/**/*.mdx",
    "../src/common/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ]
};
export default config;