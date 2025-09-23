import { NextRequest, NextResponse } from 'next/server';
import { getPdfExport } from '@/lib/db/queries';
import { SOURCE_PDF_URL } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid export ID' }, { status: 400 });
    }

    const exportRecord = await getPdfExport(id);
    
    if (!exportRecord) {
      return NextResponse.redirect(new URL('/api/download/not-found', request.url));
    }

    if (exportRecord.status !== 'completed') {
      return NextResponse.redirect(new URL('/api/download/not-ready', request.url));
    }

    if (!exportRecord.expiresAt || new Date() > exportRecord.expiresAt) {
      return NextResponse.redirect(new URL('/api/download/expired', request.url));
    }

    // Redirect to the actual PDF URL
    return NextResponse.redirect(SOURCE_PDF_URL);
  } catch (error) {
    console.error('Error handling download:', error);
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 });
  }
}
