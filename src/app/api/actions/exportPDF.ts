'use server';

import { qstash } from '@/lib/qstash';

export async function queueExportJob() {
  const tempUrl =
    'https://sylla-dev-public-bucket.s3.eu-central-1.amazonaws.com/books/47f4cad9aa3c005ce22fbdef05545308495bd571c55e02f7ae69353ac831d787';
  const reference = Math.random().toString(36).substring(2);

  try {
    const res = await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/handle-job`,
      body: {
        fileName: `sylla-export-${reference}.pdf`,
        tempUrl,
        reference,
      },
    });

    // Validate QStash response
    if (!res?.messageId) {
      throw new Error('QStash response missing messageId');
    }

    return { message: 'Job scheduled', reference };
  } catch (error) {
    // This will be caught by your app/error.tsx
    throw new Error('Failed to queue export via QStash' + error);
  }
}
