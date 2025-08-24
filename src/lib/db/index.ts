import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema/index';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
