const merge = require('merge')
const ts_preset = require('ts-jest/jest-preset')
const puppeteer_preset = require('jest-puppeteer/jest-preset')

// module.exports = {
//   //preset: 'ts-jest',
//   //preset: ['ts-jest', 'jest-puppeteer'],
//   //preset: 'jest-puppeteer',
//   //testEnvironment: 'node',
//   "roots": [
//     "<rootDir>/src"
//   ],
//   testMatch: [
//     "**/__tests__/**/*.+(ts|tsx|js)",
//     //"**/?(*.)+(spec|test).+(ts|tsx|js)"
//   ],
//   "transform": {
//     "^.+\\.(ts|tsx)$": "ts-jest"
//   }
// };

module.exports = merge.recursive({}, ts_preset, {
  // "globalSetup": "jest-environment-puppeteer/setup",
  // "globalTeardown": "jest-environment-puppeteer/teardown",
  // "testEnvironment": "jest-environment-puppeteer",
  globals: {
    //test_url: `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`,
  },
  testEnvironment: 'jsdom',
  //testEnvironment: 'node',
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    //"**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFiles: ['./setup-jest.js'],
})