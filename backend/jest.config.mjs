// jest.config.mjs
export default {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  testMatch: ["**/*.test.(ts|tsx|js|jsx|mjs)"],
  moduleNameMapper: {
    // This helps with module resolution for TypeScript/ESM imports
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^(\\.{1,2}/.*)\\.ts$": "$1",
  },
};
