import { z } from 'zod';

export const exportDataSchema = z.object({
  url: z.string().nullable(),
  reference: z.string().nullable(),
  name: z.string().nullable(),
  createdAt: z.date().nullable(),
  error: z.string().optional(),
});

export type ExportData = z.infer<typeof exportDataSchema>;
