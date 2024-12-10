module.exports = {
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    moduleNameMapper: {
      '^axios$': '<rootDir>/src/__mocks__/axios.js',
    },
  };
  