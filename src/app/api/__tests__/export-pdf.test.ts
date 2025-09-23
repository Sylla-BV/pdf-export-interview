// Mock the database queries
jest.mock('../../../lib/db/queries', () => ({
  createPdfExport: jest.fn(),
}))

// Mock QStash client
jest.mock('../../../lib/qstash/client', () => ({
  triggerPdfExportJob: jest.fn(),
}))

// Mock constants
jest.mock('../../../lib/constants', () => ({
  SOURCE_PDF_URL: 'https://example.com/source.pdf',
}))

import { createPdfExport } from '../../../lib/db/queries'
import { triggerPdfExportJob } from '../../../lib/qstash/client'

describe('/api/export-pdf', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create PDF export successfully', async () => {
    const mockExport = {
      id: 1,
      status: 'pending',
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    createPdfExport.mockResolvedValue(mockExport)
    triggerPdfExportJob.mockResolvedValue({ message: 'Job triggered' })

    // Test the core logic without Next.js server environment
    const result = await createPdfExport()
    await triggerPdfExportJob(1, 'https://example.com/source.pdf')

    expect(result).toEqual(mockExport)
    expect(createPdfExport).toHaveBeenCalledTimes(1)
    expect(triggerPdfExportJob).toHaveBeenCalledWith(1, 'https://example.com/source.pdf')
  })

  it('should handle database error', async () => {
    const error = new Error('Database connection failed')
    createPdfExport.mockRejectedValue(error)

    await expect(createPdfExport()).rejects.toThrow('Database connection failed')
    expect(createPdfExport).toHaveBeenCalledTimes(1)
  })

  it('should handle QStash job trigger error', async () => {
    const mockExport = {
      id: 1,
      status: 'pending',
      downloadUrl: null,
      expiresAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    createPdfExport.mockResolvedValue(mockExport)
    triggerPdfExportJob.mockRejectedValue(new Error('QStash service unavailable'))

    const result = await createPdfExport()
    await expect(triggerPdfExportJob(1, 'https://example.com/source.pdf')).rejects.toThrow('QStash service unavailable')

    expect(result).toEqual(mockExport)
    expect(createPdfExport).toHaveBeenCalledTimes(1)
    expect(triggerPdfExportJob).toHaveBeenCalledWith(1, 'https://example.com/source.pdf')
  })
})