import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3001').transform(Number),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Supabase
    SUPABASE_URL: z.string().url().default('https://your-project.supabase.co'),
    SUPABASE_SERVICE_ROLE_KEY: z.string().default('your-service-role-key'),
    DATABASE_URL: z.string().url().default('postgresql://postgres:password@localhost:5432/postgres'),

    // OpenSky Network
    OPENSKY_USERNAME: z.string().default(''),
    OPENSKY_PASSWORD: z.string().default(''),

    // ADS-B Exchange
    ADSBX_API_KEY: z.string().default(''),

    // Celestrak
    CELESTRAK_URL: z
        .string()
        .default('https://celestrak.com/NORAD/elements/gp.php?GROUP=active&FORMAT=tle'),

    // Optional
    REDIS_URL: z.string().optional(),
    SENTRY_DSN: z.string().optional(),

    FRONTEND_URL: z.string().default(process.env.NODE_ENV === 'production' ? 'https://heimdallrproject.vercel.app' : 'http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
    env = envSchema.parse(process.env);
} catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
}

export { env };
