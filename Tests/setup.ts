// tests/setup.ts — Global Vitest setup for Atelier
import { existsSync, readFileSync } from 'node:fs'
import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

if (existsSync('.env.test')) {
  const lines = readFileSync('.env.test', 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const index = trimmed.indexOf('=')
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')
    process.env[key] ??= value
  }
}

// Cleanup DOM after every test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Suppress Next.js router warnings in component tests
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
  headers: () => new Headers(),
}))
