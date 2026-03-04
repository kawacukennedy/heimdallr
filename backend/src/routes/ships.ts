/**
 * Ships Route — REST endpoint for querying ship data and maritime tracking.
 */
import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

export async function shipsRoutes(fastify: FastifyInstance) {
    // GET /api/ships — get all tracked ships
    fastify.get('/api/ships', async (_request, reply) => {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('ships')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(500);

        if (error) {
            return reply.status(500).send({ error: error.message });
        }
        return reply.send(data || []);
    });

    // GET /api/ships/bounds — get ships within bounding box
    fastify.get<{
        Querystring: { south: string; west: string; north: string; east: string };
    }>('/api/ships/bounds', async (request, reply) => {
        const { south, west, north, east } = request.query;
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('ships')
            .select('*')
            .gte('lat', parseFloat(south))
            .lte('lat', parseFloat(north))
            .gte('lon', parseFloat(west))
            .lte('lon', parseFloat(east))
            .limit(200);

        if (error) {
            return reply.status(500).send({ error: error.message });
        }
        return reply.send(data || []);
    });

    // GET /api/ships/:mmsi — get specific ship by MMSI
    fastify.get<{ Params: { mmsi: string } }>('/api/ships/:mmsi', async (request, reply) => {
        const { mmsi } = request.params;
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('ships')
            .select('*')
            .eq('mmsi', mmsi)
            .single();

        if (error || !data) {
            return reply.status(404).send({ error: 'Ship not found' });
        }
        return reply.send(data);
    });

    // GET /api/ships/count — count tracked ships
    fastify.get('/api/ships/count', async (_request, reply) => {
        const supabase = getSupabaseClient();
        const { count, error } = await supabase
            .from('ships')
            .select('*', { count: 'exact', head: true });

        if (error) {
            return reply.send({ count: 0 });
        }
        return reply.send({ count: count || 0 });
    });
}
