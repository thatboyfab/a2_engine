module.exports = {
  testMatch: [
    "<rootDir>/services/**/tests/**/*.js",
    "<rootDir>/libs/**/tests/**/*.js"
  ],
  testEnvironment: "node",
  verbose: true,
  detectOpenHandles: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Example: mock static assets or aliases
    "^@common/(.*)$": "<rootDir>/libs/common/src/$1",
    "^@shared/(.*)$": "<rootDir>/libs/shared-libraries/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/"
  ],
  roots: ["<rootDir>/services", "<rootDir>/libs"],
  collectCoverage: true,
  collectCoverageFrom: [
    "services/*/src/**/*.js",
    "libs/*/src/**/*.js",
    "!**/node_modules/**",
    "!**/tests/**"
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 63,
      lines: 70,
      statements: 70
    }
  }
};
