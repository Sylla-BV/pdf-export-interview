import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5433/pdf_export_db';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
