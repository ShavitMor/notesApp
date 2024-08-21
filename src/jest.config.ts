module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/tests/**/*.test.ts'], 
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
