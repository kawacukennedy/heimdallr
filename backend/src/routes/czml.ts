/**
 * CZML Route — Compiles historical position data into CZML format for 4D playback.
 * CZML (Cesium Language) is designed for time-dynamic scenes in CesiumJS.
 */
import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

interface CzmlPacket {
    id: string;
    name?: string;
    description?: string;
    availability?: string;
    position?: {
        epoch: string;
        cartographicDegrees: number[];
    };
    point?: {
        color?: { rgba: number[] };
        pixelSize?: number;
        outlineColor?: { rgba: number[] };
        outlineWidth?: number;
    };
    path?: {
        material?: { solidColor?: { color?: { rgba: number[] } } };
        width?: number;
        leadTime?: number;
        trailTime?: number;
        resolution?: number;
    };
    label?: {
        text?: string;
        font?: string;
        fillColor?: { rgba: number[] };
        show?: boolean;
    };
}

function buildCzmlDocument(
    startTime: string,
    endTime: string,
    positions: any[],
    entityType?: string
): CzmlPacket[] {
    const czml: CzmlPacket[] = [
        {
            id: 'document',
            name: 'Heimdallr Historical Playback',
            availability: `${startTime}/${endTime}`,
        },
    ];

    // Group positions by entity_id
    const entityGroups = new Map<string, any[]>();
    for (const pos of positions) {
        if (!entityGroups.has(pos.entity_id)) {
            entityGroups.set(pos.entity_id, []);
        }
        entityGroups.get(pos.entity_id)!.push(pos);
    }

    for (const [entityId, positionList] of entityGroups) {
        if (positionList.length < 2) continue; // Need at least 2 points for interpolation

        const sortedPositions = positionList.sort(
            (a: any, b: any) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
        );

        const epoch = sortedPositions[0].recorded_at;
        const epochTime = new Date(epoch).getTime();
        const cartographicDegrees: number[] = [];

        for (const pos of sortedPositions) {
            const timeDelta = (new Date(pos.recorded_at).getTime() - epochTime) / 1000;
            cartographicDegrees.push(
                timeDelta,
                pos.lon,
                pos.lat,
                pos.alt || 0
            );
        }

        const type = sortedPositions[0].entity_type;
        const metadata = sortedPositions[0].metadata || {};
        const name = metadata.callsign || metadata.name || entityId;

        // Color based on entity type
        let color: number[];
        let pointSize: number;
        switch (type) {
            case 'flight':
                color = [255, 255, 255, 255]; // White
                pointSize = 6;
                break;
            case 'military':
                color = [255, 165, 0, 255]; // Orange
                pointSize = 8;
                break;
            case 'ship':
                color = [0, 150, 255, 255]; // Blue
                pointSize = 8;
                break;
            case 'satellite':
                color = [0, 255, 0, 255]; // Green
                pointSize = 4;
                break;
            default:
                color = [200, 200, 200, 255]; // Gray
                pointSize = 6;
        }

        const firstTime = sortedPositions[0].recorded_at;
        const lastTime = sortedPositions[sortedPositions.length - 1].recorded_at;

        czml.push({
            id: `${type}-${entityId}`,
            name,
            description: `${type}: ${name}`,
            availability: `${firstTime}/${lastTime}`,
            position: {
                epoch,
                cartographicDegrees,
            },
            point: {
                color: { rgba: color },
                pixelSize: pointSize,
                outlineColor: { rgba: [0, 0, 0, 255] },
                outlineWidth: 1,
            },
            path: {
                material: { solidColor: { color: { rgba: [...color.slice(0, 3), 100] } } },
                width: 2,
                leadTime: 300,
                trailTime: 600,
                resolution: 60,
            },
            label: {
                text: name,
                font: '12px Inter, sans-serif',
                fillColor: { rgba: color },
                show: false,
            },
        });
    }

    return czml;
}

export async function czmlRoutes(fastify: FastifyInstance) {
    // GET /api/czml — compile historical data into CZML format
    fastify.get<{
        Querystring: {
            start?: string;
            end?: string;
            type?: string;
            limit?: string;
        };
    }>('/api/czml', async (request, reply) => {
        const {
            start = new Date(Date.now() - 3600000).toISOString(), // Default: last hour
            end = new Date().toISOString(),
            type,
            limit = '10000',
        } = request.query;

        const supabase = getSupabaseClient();

        let query = supabase
            .from('historical_positions')
            .select('*')
            .gte('recorded_at', start)
            .lte('recorded_at', end)
            .order('recorded_at')
            .limit(parseInt(limit));

        if (type) {
            query = query.eq('entity_type', type);
        }

        const { data, error } = await query;

        if (error) {
            return reply.status(500).send({ error: error.message });
        }

        const czml = buildCzmlDocument(start, end, data || [], type);

        reply.header('Content-Type', 'application/json');
        return reply.send(czml);
    });

    // GET /api/czml/available — check available time ranges
    fastify.get('/api/czml/available', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data: earliest } = await supabase
            .from('historical_positions')
            .select('recorded_at')
            .order('recorded_at', { ascending: true })
            .limit(1)
            .single();

        const { data: latest } = await supabase
            .from('historical_positions')
            .select('recorded_at')
            .order('recorded_at', { ascending: false })
            .limit(1)
            .single();

        const { count } = await supabase
            .from('historical_positions')
            .select('*', { count: 'exact', head: true });

        return reply.send({
            earliest: earliest?.recorded_at || null,
            latest: latest?.recorded_at || null,
            totalRecords: count || 0,
        });
    });
}
