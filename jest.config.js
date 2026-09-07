// eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS, matching Next's own next/jest setup
const nextJest = require("next/jest");

// Loads next.config.ts/.babelrc for the SWC transform, so `@/` path aliases
// resolve the same way here as everywhere else in the app.
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  // Pure-function tests only for now — no DOM needed.
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

module.exports = createJestConfig(customJestConfig);
