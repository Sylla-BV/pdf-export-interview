import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExportState } from '../use-export-state'
import { ExportStatus } from '@/types/pdf-export'

// Mock the hooks
jest.mock('../use-pdf-export', () => ({
  useTriggerExport: jest.fn(),
  useLatestExport: jest.fn(),
  useExportStatus: jest.fn(),
}))

import { useTriggerExport, useLatestExport, useExportStatus } from '../use-pdf-export'

const mockUseTriggerExport = useTriggerExport as jest.MockedFunction<typeof useTriggerExport>
const mockUseLatestExport = useLatestExport as jest.MockedFunction<typeof useLatestExport>
const mockUseExportStatus = useExportStatus as jest.MockedFunction<typeof useExportStatus>

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

describe('useExportState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct state when no export is active', () => {
    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: null,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeExportData).toBeNull()
    expect(result.current.isExportInProgress).toBe(false)
    expect(result.current.isExportCompleted).toBe(false)
    expect(result.current.isLinkActive).toBe(false)
    expect(result.current.shouldDisableButton).toBe(false)
    expect(result.current.hasError).toBe(false)
  })

  it('should return correct state when export is pending', () => {
    const mockExport = {
      id: 1,
      status: ExportStatus.PENDING,
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: mockExport,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeExportData).toEqual(mockExport)
    expect(result.current.isExportInProgress).toBe(true)
    expect(result.current.isExportCompleted).toBe(false)
    expect(result.current.isLinkActive).toBe(false)
    expect(result.current.shouldDisableButton).toBe(true)
    expect(result.current.hasError).toBe(false)
  })

  it('should return correct state when export is completed with active link', () => {
    const mockExport = {
      id: 1,
      status: ExportStatus.COMPLETED,
      downloadUrl: 'http://example.com/download',
      expiresAt: new Date(Date.now() + 60000), // 1 minute in future
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: mockExport,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeExportData).toEqual(mockExport)
    expect(result.current.isExportInProgress).toBe(false)
    expect(result.current.isExportCompleted).toBe(true)
    expect(result.current.isLinkActive).toBe(true)
    expect(result.current.shouldDisableButton).toBe(true)
    expect(result.current.hasError).toBe(false)
  })

  it('should return correct state when export is completed with expired link', () => {
    const mockExport = {
      id: 1,
      status: ExportStatus.COMPLETED,
      downloadUrl: 'http://example.com/download',
      expiresAt: new Date(Date.now() - 60000), // 1 minute in past
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: mockExport,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeExportData).toEqual(mockExport)
    expect(result.current.isExportInProgress).toBe(false)
    expect(result.current.isExportCompleted).toBe(true)
    expect(result.current.isLinkActive).toBe(false)
    expect(result.current.shouldDisableButton).toBe(false)
    expect(result.current.hasError).toBe(false)
  })

  it('should return correct state when export failed', () => {
    const mockExport = {
      id: 1,
      status: ExportStatus.FAILED,
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: mockExport,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.activeExportData).toEqual(mockExport)
    expect(result.current.isExportInProgress).toBe(false)
    expect(result.current.isExportCompleted).toBe(false)
    expect(result.current.isLinkActive).toBe(false)
    expect(result.current.shouldDisableButton).toBe(false)
    expect(result.current.hasError).toBe(false)
  })

  it('should handle trigger export error', () => {
    const mockError = new Error('Export failed')

    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: true,
      error: mockError,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: null,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasError).toBe(true)
    expect(result.current.errorMessage).toBe('Export failed')
  })

  it('should handle export status error', () => {
    const mockError = new Error('Status fetch failed')

    mockUseTriggerExport.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: null,
      error: mockError,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    expect(result.current.hasError).toBe(true)
    expect(result.current.errorMessage).toBe('Status fetch failed')
  })

  it('should call startExportLoading and triggerExport when handleExport is called', () => {
    const mockMutate = jest.fn()

    mockUseTriggerExport.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    } as any)

    mockUseLatestExport.mockReturnValue({
      data: null,
      error: null,
    } as any)

    mockUseExportStatus.mockReturnValue({
      data: null,
      error: null,
    } as any)

    const { result } = renderHook(() => useExportState(), {
      wrapper: createWrapper(),
    })

    result.current.startExportLoading()
    result.current.triggerExport()

    expect(mockMutate).toHaveBeenCalled()
  })
})
