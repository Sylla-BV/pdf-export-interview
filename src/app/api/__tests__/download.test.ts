// Mock the database queries
jest.mock('../../../lib/db/queries', () => ({
  getPdfExportById: jest.fn(),
}))

// Mock constants
jest.mock('../../../lib/constants', () => ({
  DOWNLOAD_EXPIRATION_SECONDS: 120,
}))

import { getPdfExportById } from '../../../lib/db/queries'

describe('/api/download/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return valid export for download', async () => {
    const mockExport = {
      id: 1,
      status: 'completed',
      downloadUrl: 'https://example.com/download.pdf',
      expiresAt: new Date(Date.now() + 120000), // 2 minutes from now
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    getPdfExportById.mockResolvedValue(mockExport)

    const result = await getPdfExportById(1)

    expect(result).toEqual(mockExport)
    expect(getPdfExportById).toHaveBeenCalledWith(1)
  })

  it('should return null for non-existent export', async () => {
    getPdfExportById.mockResolvedValue(null)

    const result = await getPdfExportById(999)

    expect(result).toBeNull()
    expect(getPdfExportById).toHaveBeenCalledWith(999)
  })

  it('should return export with expired timestamp', async () => {
    const mockExport = {
      id: 1,
      status: 'completed',
      downloadUrl: 'https://example.com/download.pdf',
      expiresAt: new Date(Date.now() - 1000), // Expired 1 second ago
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    getPdfExportById.mockResolvedValue(mockExport)

    const result = await getPdfExportById(1)

    expect(result).toEqual(mockExport)
    expect(result?.expiresAt).toBeInstanceOf(Date)
    expect(result?.expiresAt!.getTime()).toBeLessThan(Date.now())
  })

  it('should return export with failed status', async () => {
    const mockExport = {
      id: 1,
      status: 'failed',
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    getPdfExportById.mockResolvedValue(mockExport)

    const result = await getPdfExportById(1)

    expect(result).toEqual(mockExport)
    expect(result?.status).toBe('failed')
    expect(result?.downloadUrl).toBeNull()
  })

  it('should return export with processing status', async () => {
    const mockExport = {
      id: 1,
      status: 'processing',
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    getPdfExportById.mockResolvedValue(mockExport)

    const result = await getPdfExportById(1)

    expect(result).toEqual(mockExport)
    expect(result?.status).toBe('processing')
    expect(result?.downloadUrl).toBeNull()
  })

  it('should handle database error', async () => {
    const error = new Error('Database connection failed')
    getPdfExportById.mockRejectedValue(error)

    await expect(getPdfExportById(1)).rejects.toThrow('Database connection failed')
    expect(getPdfExportById).toHaveBeenCalledWith(1)
  })
})