import { createPdfExport, getPdfExport, updatePdfExportStatus, getLatestPdfExport } from '../queries'
import { ExportStatus } from '@/types/pdf-export'

// Mock the database connection
jest.mock('../connection', () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    set: jest.fn().mockReturnThis(),
  },
}))

// Mock drizzle-orm functions
jest.mock('drizzle-orm', () => ({
  eq: jest.fn((field, value) => ({ field, value, operator: 'eq' })),
  desc: jest.fn((field) => ({ field, direction: 'desc' })),
  gt: jest.fn((field, value) => ({ field, value, operator: 'gt' })),
}))

// Mock the schema
jest.mock('@/db/schema', () => ({
  pdfExports: {
    id: 'id',
    status: 'status',
    downloadUrl: 'download_url',
    expiresAt: 'expires_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
}))

// Mock constants
jest.mock('@/lib/constants', () => ({
  createExpirationTime: jest.fn(() => new Date(Date.now() + 120000)),
}))

import { db } from '../connection'

describe('Database Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createPdfExport', () => {
    it('should create a new PDF export with pending status', async () => {
      const mockExport = {
        id: 1,
        status: 'pending',
        downloadUrl: null,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockExport]),
        }),
      })

      const result = await createPdfExport()

      expect(db.insert).toHaveBeenCalled()
      expect(result).toEqual(mockExport)
    })
  })

  describe('getPdfExport', () => {
    it('should return export when found and not expired', async () => {
      const mockExport = {
        id: 1,
        status: 'completed',
        downloadUrl: 'http://example.com/download',
        expiresAt: new Date(Date.now() + 60000), // 1 minute in future
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockExport]),
          }),
        }),
      })

      const result = await getPdfExport(1)

      expect(result).toEqual(mockExport)
    })

    it('should return null when export is expired', async () => {
      const mockExport = {
        id: 1,
        status: 'completed',
        downloadUrl: 'http://example.com/download',
        expiresAt: new Date(Date.now() - 60000), // 1 minute in past
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([mockExport]),
          }),
        }),
      })

      const result = await getPdfExport(1)

      expect(result).toBeNull()
    })

    it('should return null when export not found', async () => {
      ;(db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      })

      const result = await getPdfExport(999)

      expect(result).toBeNull()
    })
  })

  describe('updatePdfExportStatus', () => {
    it('should update export status without download URL', async () => {
      const mockUpdatedExport = {
        id: 1,
        status: 'completed',
        downloadUrl: null,
        expiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([mockUpdatedExport]),
          }),
        }),
      })

      const result = await updatePdfExportStatus(1, ExportStatus.COMPLETED)

      expect(db.update).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedExport)
    })

    it('should update export status with download URL and expiration', async () => {
      const mockUpdatedExport = {
        id: 1,
        status: 'completed',
        downloadUrl: 'http://example.com/download',
        expiresAt: new Date(Date.now() + 120000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([mockUpdatedExport]),
          }),
        }),
      })

      const result = await updatePdfExportStatus(1, ExportStatus.COMPLETED, 'http://example.com/download')

      expect(db.update).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedExport)
    })
  })

  describe('getLatestPdfExport', () => {
    it('should return latest non-expired export', async () => {
      const mockExport = {
        id: 1,
        status: 'completed',
        downloadUrl: 'http://example.com/download',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([mockExport]),
            }),
          }),
        }),
      })

      const result = await getLatestPdfExport()

      expect(result).toEqual(mockExport)
    })

    it('should return null when no exports found', async () => {
      ;(db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            orderBy: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      })

      const result = await getLatestPdfExport()

      expect(result).toBeNull()
    })
  })
})
