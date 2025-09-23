// Timer and polling constants
export const TIMER_INTERVAL = 1000; // 1 second
export const POLLING_INTERVAL = 200; // 200ms for near real-time updates
export const EXPIRATION_DURATION = 120 * 1000; // 120 seconds in milliseconds

// PDF source URL (immutable)
export const SOURCE_PDF_URL = 'https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787';

// Helper function to create expiration time in local timezone
export function createExpirationTime(): Date {
  const now = new Date();
  return new Date(now.getTime() + EXPIRATION_DURATION);
}

// API endpoints
export const API_ENDPOINTS = {
  EXPORT_PDF: '/api/export-pdf',
  EXPORTS_LATEST: '/api/exports/latest',
  EXPORTS_BY_ID: (id: number) => `/api/exports/${id}`,
} as const;

// Export status values
export const EXPORT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// UI constants
export const UI_CONSTANTS = {
  MAX_WIDTH: 'max-w-md',
  BUTTON_SIZE: 'lg',
  ANIMATION_DURATION: 'duration-200',
} as const;
