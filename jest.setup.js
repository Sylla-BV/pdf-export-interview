require('@testing-library/jest-dom')

// Polyfill for Node.js APIs in jsdom environment
// Note: NextRequest extends Request, so we don't override the global Request

global.Response = global.Response || class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Map(Object.entries(init?.headers || {}))
  }
}

global.Headers = global.Headers || class Headers {
  constructor(init) {
    this.map = new Map(Object.entries(init || {}))
  }
  get(name) {
    return this.map.get(name.toLowerCase())
  }
  set(name, value) {
    this.map.set(name.toLowerCase(), value)
  }
  has(name) {
    return this.map.has(name.toLowerCase())
  }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock fetch globally
global.fetch = jest.fn()

// Mock environment variables
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.QSTASH_TOKEN = 'test_token'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
