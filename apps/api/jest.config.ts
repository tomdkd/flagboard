// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\@api/(.*))$': '<rootDir>/src/$2',
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/config/env.ts",
    "/database/",
    "/database/schemas/",
    "/routes/",
    "/tenants/repositories/",
  ]
};

export default config;