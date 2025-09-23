import { NextRequest, NextResponse } from 'next/server';
import { getPdfExport, updatePdfExportStatus } from '@/lib/db/queries';
import { exportStatusResponseSchema } from '@/lib/validation/schemas';
import { ExportStatus } from '@/types/pdf-export';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid export ID' },
        { status: 400 }
      );
    }

    const exportRecord = await getPdfExport(id);
    if (!exportRecord) {
      return NextResponse.json(
        { error: 'Export not found' },
        { status: 404 }
      );
    }

    // Validate response
    const validatedResponse = exportStatusResponseSchema.parse(exportRecord);
    return NextResponse.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching PDF export:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF export' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid export ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, downloadUrl } = body;

    // Validate status
    console.log('Received status:', status);
    console.log('Valid statuses:', Object.values(ExportStatus));
    console.log('Is valid:', Object.values(ExportStatus).includes(status));
    
    if (!status || !Object.values(ExportStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, processing, completed, failed, expired' },
        { status: 400 }
      );
    }

    // Update the export
    const updatedExport = await updatePdfExportStatus(id, status, downloadUrl);
    
    if (!updatedExport) {
      return NextResponse.json(
        { error: 'Export not found' },
        { status: 404 }
      );
    }

    // Validate response
    const validatedResponse = exportStatusResponseSchema.parse(updatedExport);
    return NextResponse.json({ success: true, export: validatedResponse });
  } catch (error) {
    console.error('Error updating PDF export:', error);
    return NextResponse.json(
      { error: 'Failed to update PDF export' },
      { status: 500 }
    );
  }
}
