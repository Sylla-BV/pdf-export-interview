// Mock the database queries
jest.mock('../../../lib/db/queries', () => ({
  updatePdfExportStatus: jest.fn(),
  updatePdfExportDownloadUrl: jest.fn(),
}))

import { updatePdfExportStatus, updatePdfExportDownloadUrl } from '../../../lib/db/queries'

describe('/api/webhooks/qstash', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle successful PDF generation', async () => {
    updatePdfExportStatus.mockResolvedValue(undefined)
    updatePdfExportDownloadUrl.mockResolvedValue(undefined)

    await updatePdfExportStatus(1, 'completed')
    await updatePdfExportDownloadUrl(1, 'https://example.com/download.pdf')

    expect(updatePdfExportStatus).toHaveBeenCalledWith(1, 'completed')
    expect(updatePdfExportDownloadUrl).toHaveBeenCalledWith(1, 'https://example.com/download.pdf')
  })

  it('should handle failed PDF generation', async () => {
    updatePdfExportStatus.mockResolvedValue(undefined)

    await updatePdfExportStatus(1, 'failed')

    expect(updatePdfExportStatus).toHaveBeenCalledWith(1, 'failed')
    expect(updatePdfExportDownloadUrl).not.toHaveBeenCalled()
  })

  it('should handle database update error', async () => {
    const error = new Error('Database connection failed')
    updatePdfExportStatus.mockRejectedValue(error)

    await expect(updatePdfExportStatus(1, 'completed')).rejects.toThrow('Database connection failed')
    expect(updatePdfExportStatus).toHaveBeenCalledWith(1, 'completed')
  })

  it('should handle download URL update error', async () => {
    const error = new Error('Database connection failed')
    updatePdfExportDownloadUrl.mockRejectedValue(error)

    await expect(updatePdfExportDownloadUrl(1, 'https://example.com/download.pdf')).rejects.toThrow('Database connection failed')
    expect(updatePdfExportDownloadUrl).toHaveBeenCalledWith(1, 'https://example.com/download.pdf')
  })

  it('should handle multiple status updates', async () => {
    updatePdfExportStatus.mockResolvedValue(undefined)

    await updatePdfExportStatus(1, 'processing')
    await updatePdfExportStatus(1, 'completed')

    expect(updatePdfExportStatus).toHaveBeenCalledTimes(2)
    expect(updatePdfExportStatus).toHaveBeenNthCalledWith(1, 1, 'processing')
    expect(updatePdfExportStatus).toHaveBeenNthCalledWith(2, 1, 'completed')
  })
})