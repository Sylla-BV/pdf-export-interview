import { NextResponse } from 'next/server';

import { db } from '@/db/index';
import { pdf_exports } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export const dynamic = 'force-dynamic';


export const GET = async (_: Request, { params }: { params: { token: string } }) => {
  try {
    const { token } = params;
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const now = new Date();
    const result = await db
      .select()
      .from(pdf_exports)
      .where(and(eq(pdf_exports.token, token), gt(pdf_exports.expires_at, now)));

    if (!result.length) {
      return NextResponse.json({ error: 'Not found or expired' }, { status: 404 });
    }

    const response = await fetch(result[0].pdf_url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 });
    }

    const headers = new Headers(response.headers);
    headers.set('content-disposition', `inline; filename="${token}.pdf"`);
    headers.set('cache-control', 'no-store');
    headers.set('x-expires-at', result[0].expires_at.toISOString());

    return new Response(response.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
