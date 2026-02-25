import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { env } from '../config/env';

export async function runMigrationsAndSeed() {
    if (!env.DATABASE_URL || env.DATABASE_URL.includes('your-project') || (env.NODE_ENV === 'production' && env.DATABASE_URL.includes('localhost'))) {
        console.warn('⚠️ No valid production DATABASE_URL provided. Skipping database migrations and seeding until explicitly configured.');
        return;
    }

    try {
        const isLocalHost = env.DATABASE_URL.includes('localhost') || env.DATABASE_URL.includes('127.0.0.1');

        // Force direct database connection for migrations because the Supabase 6543 Pooler times out 
        // with prepared statements on IPv4 Render environments.
        let dbUrl = env.DATABASE_URL;
        if (dbUrl.includes('.supabase.co') && dbUrl.includes('6543')) {
            dbUrl = dbUrl.replace(':6543', ':5432');
            dbUrl = dbUrl.replace('?pgbouncer=true', '');
            dbUrl = dbUrl.replace('&pgbouncer=true', '');
        }

        const sql = postgres(dbUrl, { ssl: isLocalHost ? false : 'require', idle_timeout: 20, max: 1 });

        console.log('📦 Connected to database. Starting migrations and seeding...');

        // Ensure migrations tracking table exists
        await sql`
            CREATE TABLE IF NOT EXISTS _migrations (
                id SERIAL PRIMARY KEY,
                filename TEXT UNIQUE NOT NULL,
                applied_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        const migrationsDir = path.resolve(__dirname, '../../../database/migrations');
        if (!fs.existsSync(migrationsDir)) {
            console.warn(`⚠️ Migrations directory not found at ${migrationsDir}`);
            await sql.end();
            return;
        }

        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            console.log(`⏳ Applying ${file}...`);
            const filePath = path.join(migrationsDir, file);

            // Note: sql.file automatically handles postgres multi-line statements
            await sql.file(filePath);
            await sql`INSERT INTO _migrations (filename) VALUES (${file}) ON CONFLICT DO NOTHING`;
            console.log(`✅ Successfully applied ${file}`);
        }

        await sql.end();
        console.log('🎉 Database migrations and seeding completed.');
    } catch (error) {
        console.error('❌ Error applying database migrations:', error);
    }
}
