import { NextResponse } from 'next/server';

import { SOURCE_PDF_URL } from '@/lib/constants';
import { createPdfExport } from '@/lib/db/queries';
import { triggerPdfExportJob } from '@/lib/qstash/client';
import { exportResponseSchema } from '@/lib/validation/schemas';

export async function POST() {
  try {
    const exportRecord = await createPdfExport();
    await triggerPdfExportJob(exportRecord.id, SOURCE_PDF_URL);

    const response = {
      id: exportRecord.id,
      status: exportRecord.status,
    };

    const validatedResponse = exportResponseSchema.parse(response);
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('Error creating PDF export:', error);
    return NextResponse.json({ error: 'Failed to create PDF export' }, { status: 500 });
  }
}
