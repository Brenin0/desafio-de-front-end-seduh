// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Aponta para a pasta do app Next.js
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Permite usar o alias @/ (ex: @/components/...)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)