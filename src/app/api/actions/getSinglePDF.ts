'use server';

import { db } from '@/db/database';
import { pdfExports } from '@/db/schema';
import { getErrorMessage } from '@/lib/errorRespose';
import { ExportData } from '@/lib/validation/exportData';
import { eq } from 'drizzle-orm';

export async function getExportByReference(reference: string): Promise<ExportData> {
  try {
    const [record] = await db
      .select()
      .from(pdfExports)
      .where(eq(pdfExports.reference, reference))
      .limit(1);

    return {
      url: record.tempUrl || null,
      reference: record.reference || null,
      name: record.fileName || null,
      createdAt: record.createdAt || null,
    };
  } catch (error) {
    return {
      url: null,
      reference: null,
      name: null,
      createdAt: null,
      error: getErrorMessage(error),
    };
  }
}
