import { z } from 'zod';
import type { CreateExportResponse, ExportStatusResponse } from '@/types/pdf-export';

export const exportStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

export const exportResponseSchema = z.object({
  id: z.number(),
  status: exportStatusSchema,
});

export const exportStatusResponseSchema = z.object({
  id: z.number(),
  status: exportStatusSchema,
  downloadUrl: z.string().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Re-export types for backward compatibility
export type { CreateExportResponse, ExportStatusResponse };
