import { NextRequest, NextResponse } from 'next/server';
import { updatePdfExportStatus } from '@/lib/db/queries';
import type { QStashJobPayload } from '@/lib/qstash/client';

export async function POST(request: NextRequest) {
  try {
    const payload: QStashJobPayload = await request.json();
    const { exportId, sourceUrl } = payload;

    // Validate required environment variables
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      throw new Error('NEXT_PUBLIC_BASE_URL environment variable is required');
    }

    // Simulate PDF processing (in real implementation, this would be actual PDF generation)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate temporary download URL (in production, this would be a signed URL)
    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download/${exportId}`;

    // Update database with completed status
    await updatePdfExportStatus(exportId, 'completed', downloadUrl);

    console.log(`Export ${exportId} completed successfully`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing QStash webhook:', error);
    
    // Try to update status to failed
    try {
      const payload: QStashJobPayload = await request.json();
      await updatePdfExportStatus(payload.exportId, 'failed');
    } catch (updateError) {
      console.error('Error updating failed status:', updateError);
    }

    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
