import { Client } from '@upstash/qstash';

// Validate required environment variables
if (!process.env.QSTASH_TOKEN) {
  throw new Error('QSTASH_TOKEN environment variable is required');
}

// Initialize QStash client
export const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
});

export interface QStashJobPayload {
  exportId: number;
  sourceUrl: string;
}

export async function triggerPdfExportJob(exportId: number, sourceUrl: string) {
  const payload: QStashJobPayload = {
    exportId,
    sourceUrl,
  };

  // Validate required environment variables
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is required');
  }

  // For local development, simulate the webhook call directly
  if (process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
    console.log('Local development detected - simulating webhook call');
    
    // Simulate the webhook call directly since QStash can't reach localhost
    setTimeout(async () => {
      try {
        const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/qstash`;
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          console.log('Webhook simulation completed successfully for export:', exportId);
        } else {
          console.error('Webhook simulation failed with status:', response.status);
        }
      } catch (error) {
        console.error('Webhook simulation failed:', error);
      }
    }, 1000);
    
    return { message: 'Webhook simulation scheduled' };
  }

  // For production, use direct webhook
  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/qstash`;
  
  return await qstash.publish({
    url: webhookUrl,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
