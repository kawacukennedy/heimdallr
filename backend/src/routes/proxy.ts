import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import NodeCache from 'node-cache';
import { z } from 'zod';

// Cache CCTV images for 30 seconds
const imageCache = new NodeCache({ stdTTL: 30, checkperiod: 10, maxKeys: 500 });

const querySchema = z.object({
    url: z.string().url(),
});

export async function proxyRoutes(fastify: FastifyInstance) {
    fastify.get('/proxy/cctv', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const { url } = querySchema.parse(request.query);
            const decodedUrl = decodeURIComponent(url);

            // Check cache first
            const cached = imageCache.get<Buffer>(decodedUrl);
            if (cached) {
                reply.header('X-Cache', 'HIT');
                reply.header('Content-Type', 'image/jpeg');
                reply.header('Cache-Control', 'public, max-age=30');
                return reply.send(cached);
            }

            // Fetch from source
            const response = await axios.get(decodedUrl, {
                responseType: 'arraybuffer',
                timeout: 5000,
                headers: {
                    'User-Agent': 'Heimdallr/1.0',
                    Accept: 'image/*',
                },
                maxContentLength: 10 * 1024 * 1024, // 10MB max
            });

            const imageBuffer = Buffer.from(response.data);

            // Cache the image
            imageCache.set(decodedUrl, imageBuffer);

            // Determine content type
            const contentType = response.headers['content-type'] || 'image/jpeg';

            reply.header('X-Cache', 'MISS');
            reply.header('Content-Type', contentType);
            reply.header('Cache-Control', 'public, max-age=30');
            reply.header('Access-Control-Allow-Origin', '*');
            return reply.send(imageBuffer);
        } catch (error: any) {
            fastify.log.error({ error: error.message }, 'CCTV proxy failed');
            return reply.status(502).send({
                error: 'Failed to fetch CCTV image',
                message: error.message,
            });
        }
    });
}
