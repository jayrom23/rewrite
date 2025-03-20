// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // or 'node' if you are not testing UI components
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Map "@/components" to "./components" etc.
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
