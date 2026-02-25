import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env';
import { healthRoutes } from './routes/health';
import { proxyRoutes } from './routes/proxy';
import { roadsRoutes } from './routes/roads';
import { authRoutes } from './routes/auth';
import { metricsRoutes } from './routes/metrics';
import { satelliteRoutes } from './routes/satellites';
import { cctvRoutes } from './routes/cctv';
import { analyticsRoutes } from './routes/analytics';
import { startScheduler } from './jobs/scheduler';
import { httpRequestsTotal, httpRequestDuration } from './routes/metrics';
import { runMigrationsAndSeed } from './db/seed';

async function main() {
    const fastify = Fastify({
        logger: {
            level: env.NODE_ENV === 'production' ? 'info' : 'debug',
            transport:
                env.NODE_ENV !== 'production'
                    ? { target: 'pino-pretty', options: { colorize: true } }
                    : undefined,
        },
    });

    // --- Plugins ---

    // CORS
    await fastify.register(cors, {
        origin: [env.FRONTEND_URL, 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    // Security headers
    await fastify.register(helmet, {
        contentSecurityPolicy: false, // handled by Vercel for frontend
    });

    // Rate limiting
    await fastify.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        allowList: ['127.0.0.1'],
    });

    // --- Request metrics ---
    fastify.addHook('onResponse', (request, reply, done) => {
        httpRequestsTotal.inc({
            method: request.method,
            route: request.routeOptions?.url || request.url,
            status_code: reply.statusCode,
        });
        httpRequestDuration.observe(
            {
                method: request.method,
                route: request.routeOptions?.url || request.url,
            },
            reply.elapsedTime / 1000
        );
        done();
    });

    // --- Routes ---
    await fastify.register(healthRoutes);
    await fastify.register(proxyRoutes);
    await fastify.register(roadsRoutes);
    await fastify.register(authRoutes);
    await fastify.register(metricsRoutes);
    await fastify.register(satelliteRoutes);
    await fastify.register(cctvRoutes);
    await fastify.register(analyticsRoutes);

    // --- Graceful shutdown ---
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
        process.on(signal, async () => {
            fastify.log.info(`Received ${signal}, shutting down...`);
            await fastify.close();
            process.exit(0);
        });
    });

    // --- Start ---
    await runMigrationsAndSeed();

    if (!process.env.VERCEL) {
        try {
            const port = typeof env.PORT === 'number' ? env.PORT : parseInt(env.PORT as any, 10);
            await fastify.listen({ port, host: '0.0.0.0' });

            // Start cron jobs after server is listening
            startScheduler();

            fastify.log.info(`🚀 Heimdallr Backend running on port ${port}`);
        } catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    }

    return fastify;
}

const app = main();

export default async function (req: any, res: any) {
    const fastify = await app;
    await fastify.ready();
    fastify.server.emit('request', req, res);
}
