import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import os from 'os';

interface HealthResponse {
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    cpu: {
        loadAverage: number[];
        cores: number;
    };
}

export async function healthRoutes(fastify: FastifyInstance) {
    fastify.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const usedMem = totalMem - os.freemem();

        const health: HealthResponse = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            memory: {
                used: Math.round(memUsage.heapUsed / 1024 / 1024),
                total: Math.round(memUsage.heapTotal / 1024 / 1024),
                percentage: Math.round((usedMem / totalMem) * 100),
            },
            cpu: {
                loadAverage: os.loadavg(),
                cores: os.cpus().length,
            },
        };

        return reply.status(200).send(health);
    });
}
