import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

export async function satelliteRoutes(fastify: FastifyInstance) {
    // GET /api/satellites/tle — latest TLE snapshot
    fastify.get('/api/satellites/tle', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('tle_snapshots')
            .select('*')
            .order('fetched_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data || !data.tle_data) {
            return reply.status(404).send({ error: 'No TLE data available' });
        }

        return reply.send(data.tle_data);
    });

    // GET /api/satellites/count
    fastify.get('/api/satellites/count', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('tle_snapshots')
            .select('tle_data')
            .order('fetched_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            return reply.send({ count: 0 });
        }

        const entries = Array.isArray(data.tle_data) ? data.tle_data : [];
        return reply.send({ count: entries.length });
    });
}
