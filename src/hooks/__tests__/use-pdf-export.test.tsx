import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTriggerExport, useLatestExport, useExportStatus } from '../use-pdf-export'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock API endpoints
jest.mock('@/lib/constants', () => ({
  API_ENDPOINTS: {
    EXPORT_PDF: '/api/export-pdf',
    EXPORTS_LATEST: '/api/exports/latest',
    EXPORTS_BY_ID: (id: number) => `/api/exports/${id}`,
  },
}))

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useTriggerExport', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should trigger export successfully', async () => {
    const mockResponse = { id: 1, status: 'pending' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useTriggerExport(), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockFetch).toHaveBeenCalledWith('/api/export-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('should handle export failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useTriggerExport(), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Failed to trigger export')
  })
})

describe('useLatestExport', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should fetch latest export successfully', async () => {
    const mockExport = {
      id: 1,
      status: 'completed',
      downloadUrl: 'http://example.com/download',
      expiresAt: new Date(Date.now() + 60000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockExport),
    })

    const { result } = renderHook(() => useLatestExport(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockExport)
    expect(mockFetch).toHaveBeenCalledWith('/api/exports/latest')
  })

  it('should handle fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useLatestExport(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Failed to fetch latest export')
  })

  it('should return null when no exports exist', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(null),
    })

    const { result } = renderHook(() => useLatestExport(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeNull()
  })
})

describe('useExportStatus', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should fetch export status when export ID is available', async () => {
    const mockExport = {
      id: 1,
      status: 'pending',
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockExport),
    })

    // Mock the query client to return an export ID
    const queryClient = new QueryClient()
    queryClient.setQueryData(['current-export-id'], 1)

    const { result } = renderHook(() => useExportStatus(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockExport)
    expect(mockFetch).toHaveBeenCalledWith('/api/exports/1')
  })

  it('should not fetch when export ID is not available', () => {
    const { result } = renderHook(() => useExportStatus(), {
      wrapper: createWrapper(),
    })

    expect(result.current.status).toBe('pending')
    expect(result.current.fetchStatus).toBe('idle')
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should handle fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for testing
        },
      },
    })
    queryClient.setQueryData(['current-export-id'], 1)

    const { result } = renderHook(() => useExportStatus(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    }, { timeout: 3000 })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Failed to fetch export status')
  })
})
