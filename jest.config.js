const merge = require('merge')
const ts_preset = require('ts-jest/jest-preset')

module.exports = merge.recursive({}, ts_preset, {    
  testEnvironment: 'jsdom',  
  roots: [
    '<rootDir>/src'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',    
  ],
  'transform': {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  setupFiles: ['./setup-jest.js'],
})