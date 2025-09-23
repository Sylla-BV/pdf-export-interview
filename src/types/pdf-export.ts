// Domain types for PDF export functionality

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// Shared data types used across the PDF export system
export interface PdfExport {
  id: number;
  status: ExportStatus;
  downloadUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}


export interface CreateExportResponse {
  id: number;
  status: ExportStatus;
}

export interface ExportStatusResponse {
  id: number;
  status: ExportStatus;
  downloadUrl?: string;
  expiresAt?: Date;
}
