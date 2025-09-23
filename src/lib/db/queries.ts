import { db } from './connection';
import { pdfExports } from '@/db/schema';
import { eq, desc, gt } from 'drizzle-orm';
import { createExpirationTime } from '@/lib/constants';
import type { PdfExport, ExportStatus } from '@/types/pdf-export';

export async function createPdfExport(): Promise<PdfExport> {
  const [exportRecord] = await db
    .insert(pdfExports)
    .values({
      status: 'pending',
    })
    .returning();

  return exportRecord as PdfExport;
}

export async function getPdfExport(id: number): Promise<PdfExport | null> {
  const [exportRecord] = await db
    .select()
    .from(pdfExports)
    .where(eq(pdfExports.id, id))
    .limit(1);

  if (!exportRecord) {
    return null;
  }

  if (exportRecord.expiresAt && new Date(exportRecord.expiresAt) <= new Date()) {
    return null;
  }

  return exportRecord as PdfExport;
}

export async function updatePdfExportStatus(
  id: number,
  status: ExportStatus,
  downloadUrl?: string
): Promise<PdfExport | null> {
  const updateData: any = {
    status,
    updatedAt: new Date(),
  };

  if (downloadUrl) {
    updateData.downloadUrl = downloadUrl;
    updateData.expiresAt = createExpirationTime();
  }

  const [exportRecord] = await db
    .update(pdfExports)
    .set(updateData)
    .where(eq(pdfExports.id, id))
    .returning();

  return exportRecord as PdfExport | null;
}

export async function getLatestPdfExport(): Promise<PdfExport | null> {
  const now = new Date();
  
  const results = await db
    .select()
    .from(pdfExports)
    .where(gt(pdfExports.expiresAt, now))
    .orderBy(desc(pdfExports.createdAt))
    .limit(1);

  return results.length > 0 ? (results[0] as PdfExport) : null;
}
