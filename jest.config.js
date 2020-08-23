/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('merge');
const tsPreset = require('ts-jest/jest-preset');

module.exports = merge.recursive({}, tsPreset, {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/SRC'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFiles: ['./setup-jest.js'],
});
