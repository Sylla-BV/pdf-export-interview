import { db } from '@/db/database';
import { pdfExports } from '@/db/schema';
import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';

async function handler(req: Request) {
  const body = await req.json();
  const { fileName, tempUrl, reference } = body;

  if (!fileName || !tempUrl) {
    return NextResponse.json({ error: 'Missing fileName or tempUrl' }, { status: 400 });
  }

  await db.insert(pdfExports).values({
    fileName,
    tempUrl,
    reference,
  });

  return NextResponse.json({ success: true });
}

// Secure the handler with Upstash QStash signature verification
export const POST = verifySignatureAppRouter(handler);
