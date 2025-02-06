import type { Config } from 'jest'

const config: Config = {
  // Use ts-jest preset to transpile TypeScript files
  preset: 'ts-jest',
  // Specify the test environment to be Node (suitable for server-side testing)
  testEnvironment: 'node',
  // Enable verbose logging for tests
  verbose: true,
  testMatch: ['<rootDir>/server/**/*.test.ts']
}

export default config