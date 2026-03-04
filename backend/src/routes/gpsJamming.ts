/**
 * GPS Jamming Route — REST endpoints for querying GPS jamming zones.
 */
import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

export async function gpsJammingRoutes(fastify: FastifyInstance) {
    // GET /api/gps-jamming — get active jamming zones
    fastify.get('/api/gps-jamming', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('gps_jamming_zones')
            .select('*')
            .eq('active', true)
            .order('detected_at', { ascending: false });

        if (error) {
            return reply.status(500).send({ error: error.message });
        }
        return reply.send(data || []);
    });

    // GET /api/gps-jamming/history — get historical jamming data
    fastify.get<{
        Querystring: { hours?: string };
    }>('/api/gps-jamming/history', async (request, reply) => {
        const hours = parseInt(request.query.hours || '24');
        const since = new Date(Date.now() - hours * 3600000).toISOString();
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('gps_jamming_zones')
            .select('*')
            .gte('detected_at', since)
            .order('detected_at', { ascending: false })
            .limit(500);

        if (error) {
            return reply.status(500).send({ error: error.message });
        }
        return reply.send(data || []);
    });

    // GET /api/gps-jamming/stats — jamming statistics
    fastify.get('/api/gps-jamming/stats', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data: active } = await supabase
            .from('gps_jamming_zones')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);

        const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
        const { data: recent, count: recentCount } = await supabase
            .from('gps_jamming_zones')
            .select('*', { count: 'exact', head: true })
            .gte('detected_at', oneDayAgo);

        return reply.send({
            activeZones: active || 0,
            last24hZones: recentCount || 0,
        });
    });
}
