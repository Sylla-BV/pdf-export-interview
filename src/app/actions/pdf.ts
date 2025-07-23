'use server';

import { Client } from '@upstash/qstash';

export const requestPdfAction = async () => {
  const client = new Client({
    token: process.env.QSTASH_TOKEN!,
    baseUrl: process.env.QSTASH_URL!,
  });

  const token = crypto.randomUUID();

  await client.publishJSON({
    url: `${process.env.APP_URL}/api/pdf/process`,
    body: { token },
  });

  return { token };
};
