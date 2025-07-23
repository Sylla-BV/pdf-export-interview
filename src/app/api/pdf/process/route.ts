import { NextResponse } from 'next/server';

import { db } from '@/db';
import { pdf_exports } from '@/db/schema';

const EXPIRATION_SECONDS = 120;
const PDF_URL =
  'https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787';

export const POST = async (req: Request) => {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + EXPIRATION_SECONDS * 1000);

    await db.insert(pdf_exports).values({ token, pdf_url: PDF_URL, expires_at: expiresAt });

    return NextResponse.json({ message: 'Job received!' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
