// Backend configuration / rate-limit presets per-route

import rateLimit, { RateLimitPluginOptions } from '@fastify/rate-limit';

export const RATE_LIMIT_DEFAULTS: Partial<RateLimitPluginOptions> = {
    max: 100,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1'],
};

// Per-route overrides
export const ROUTE_RATE_LIMITS = {
    '/health': { max: 500, timeWindow: '1 minute' },
    '/proxy/cctv': { max: 60, timeWindow: '1 minute' },
    '/api/roads': { max: 30, timeWindow: '1 minute' },
    '/auth/login': { max: 10, timeWindow: '5 minutes' },
    '/auth/register': { max: 5, timeWindow: '15 minutes' },
    '/metrics': { max: 120, timeWindow: '1 minute' },
};
