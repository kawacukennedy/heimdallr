import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

export async function analyticsRoutes(fastify: FastifyInstance) {
    // POST /api/analytics — track event
    fastify.post<{ Body: { event_type: string; properties?: Record<string, any> } }>(
        '/api/analytics',
        async (request, reply) => {
            const { event_type, properties = {} } = request.body;

            if (!event_type) {
                return reply.status(400).send({ error: 'event_type is required' });
            }

            const supabase = getSupabaseClient();
            const { error } = await supabase.from('analytics_events').insert({
                event_type,
                properties,
            });

            if (error) {
                return reply.status(500).send({ error: error.message });
            }

            return reply.status(201).send({ success: true });
        }
    );

    // GET /api/analytics/summary — aggregate analytics
    fastify.get('/api/analytics/summary', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const oneDayAgo = new Date(Date.now() - 86400000).toISOString();

        const { data, error } = await supabase
            .from('analytics_events')
            .select('event_type')
            .gte('created_at', oneDayAgo);

        if (error) {
            return reply.status(500).send({ error: error.message });
        }

        // Aggregate counts
        const summary: Record<string, number> = {};
        (data || []).forEach((row: any) => {
            summary[row.event_type] = (summary[row.event_type] || 0) + 1;
        });

        return reply.send({
            period: '24h',
            total_events: data?.length || 0,
            by_type: summary,
        });
    });
}
