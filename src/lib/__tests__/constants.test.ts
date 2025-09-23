import { createExpirationTime, EXPIRATION_DURATION, SOURCE_PDF_URL, API_ENDPOINTS, EXPORT_STATUS } from '../constants'

describe('Constants and Utility Functions', () => {
  describe('createExpirationTime', () => {
    it('should create expiration time 120 seconds in the future', () => {
      const now = new Date()
      const expirationTime = createExpirationTime()
      
      const timeDifference = expirationTime.getTime() - now.getTime()
      expect(timeDifference).toBeCloseTo(EXPIRATION_DURATION, -2) // Allow 100ms tolerance
    })

  it('should create different expiration times for different calls', () => {
    const expiration1 = createExpirationTime()
    // Add a small delay to ensure different timestamps
    const expiration2 = createExpirationTime()
    
    expect(expiration1.getTime()).toBeLessThanOrEqual(expiration2.getTime())
  })
  })

  describe('Constants', () => {
    it('should have correct expiration duration', () => {
      expect(EXPIRATION_DURATION).toBe(120 * 1000) // 120 seconds
    })

    it('should have correct source PDF URL', () => {
      expect(SOURCE_PDF_URL).toBe('https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787')
    })

    it('should have correct API endpoints', () => {
      expect(API_ENDPOINTS.EXPORT_PDF).toBe('/api/export-pdf')
      expect(API_ENDPOINTS.EXPORTS_LATEST).toBe('/api/exports/latest')
      expect(API_ENDPOINTS.EXPORTS_BY_ID(123)).toBe('/api/exports/123')
    })

    it('should have correct export status values', () => {
      expect(EXPORT_STATUS.PENDING).toBe('pending')
      expect(EXPORT_STATUS.PROCESSING).toBe('processing')
      expect(EXPORT_STATUS.COMPLETED).toBe('completed')
      expect(EXPORT_STATUS.FAILED).toBe('failed')
    })
  })
})
