import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

export async function cctvRoutes(fastify: FastifyInstance) {
    // GET /api/cctv — all cameras
    fastify.get('/api/cctv', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('cctv_cameras')
            .select('id, lat, lon, source_url, heading, pitch, city, label')
            .order('city');

        if (error) {
            return reply.status(500).send({ error: error.message });
        }

        return reply.send(data);
    });

    // GET /api/cctv/:city — cameras by city
    fastify.get<{ Params: { city: string } }>('/api/cctv/:city', async (request, reply) => {
        const { city } = request.params;
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('cctv_cameras')
            .select('id, lat, lon, source_url, heading, pitch, city, label')
            .ilike('city', `%${city}%`);

        if (error) {
            return reply.status(500).send({ error: error.message });
        }

        return reply.send(data);
    });

    // GET /api/cctv/nearby — cameras within radius
    fastify.get<{ Querystring: { lat: string; lon: string; radius?: string } }>(
        '/api/cctv/nearby',
        async (request, reply) => {
            const { lat, lon, radius = '5000' } = request.query;
            const supabase = getSupabaseClient();

            const { data, error } = await supabase.rpc('cctv_within_radius', {
                center_lat: parseFloat(lat),
                center_lon: parseFloat(lon),
                radius_meters: parseFloat(radius),
            });

            if (error) {
                // Fallback to simple query if RPC not available
                const { data: fallback, error: fallbackErr } = await supabase
                    .from('cctv_cameras')
                    .select('*');

                if (fallbackErr) return reply.status(500).send({ error: fallbackErr.message });
                return reply.send(fallback);
            }

            return reply.send(data);
        }
    );
}
