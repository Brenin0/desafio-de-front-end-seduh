// jest.setup.ts
import '@testing-library/jest-dom'

// Polyfill para resolver problemas de ambiente com Next.js
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });