import { NextResponse } from 'next/server';
import { getLatestPdfExport } from '@/lib/db/queries';

export async function GET() {
  try {
    const exportData = await getLatestPdfExport();
    
    // Return null if no exports found (this is a valid state)
    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error fetching latest export:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest export' },
      { status: 500 }
    );
  }
}
