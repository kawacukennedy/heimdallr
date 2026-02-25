import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import client from 'prom-client';

// Create a custom registry
const register = new client.Registry();

// Default metrics
client.collectDefaultMetrics({ register });

// Custom counters
export const httpRequestsTotal = new client.Counter({
    name: 'heimdallr_http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [register],
});

export const openskyPollsTotal = new client.Counter({
    name: 'heimdallr_opensky_polls_total',
    help: 'Total OpenSky API poll attempts',
    labelNames: ['status'],
    registers: [register],
});

export const adsbxPollsTotal = new client.Counter({
    name: 'heimdallr_adsbx_polls_total',
    help: 'Total ADS-B Exchange API poll attempts',
    labelNames: ['status'],
    registers: [register],
});

export const cctvProxyRequestsTotal = new client.Counter({
    name: 'heimdallr_cctv_proxy_requests_total',
    help: 'Total CCTV proxy requests',
    labelNames: ['cache_status'],
    registers: [register],
});

// Custom histograms
export const httpRequestDuration = new client.Histogram({
    name: 'heimdallr_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    registers: [register],
});

// Gauges
export const activeFlightsGauge = new client.Gauge({
    name: 'heimdallr_active_flights',
    help: 'Number of currently tracked flights',
    labelNames: ['type'],
    registers: [register],
});

export async function metricsRoutes(fastify: FastifyInstance) {
    fastify.get('/metrics', async (_request: FastifyRequest, reply: FastifyReply) => {
        reply.header('Content-Type', register.contentType);
        return reply.send(await register.metrics());
    });
}
