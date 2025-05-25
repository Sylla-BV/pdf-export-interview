import { Client } from "@upstash/qstash";

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

await qstash.publishJSON({
  url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/handle-job`,
  body: { key: "value" },
});
