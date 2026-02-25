import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import axios from 'axios';
import { z } from 'zod';
import { getSupabaseClient } from '../config/supabase';

const cityParamSchema = z.object({
    city: z.string().min(1).max(100),
});

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function buildOverpassQuery(city: string): string {
    return `
    [out:json][timeout:30];
    area["name"="${city}"]["admin_level"~"[4-8]"]->.searchArea;
    way["highway"~"primary|secondary|tertiary|motorway|trunk"](area.searchArea);
    out geom;
  `;
}

function interpolateCoordinates(
    coords: Array<{ lat: number; lon: number }>,
    spacing: number = 50
): Array<[number, number]> {
    const result: Array<[number, number]> = [];
    for (let i = 0; i < coords.length - 1; i++) {
        const from = coords[i];
        const to = coords[i + 1];
        const dx = to.lon - from.lon;
        const dy = to.lat - from.lat;
        const dist = Math.sqrt(dx * dx + dy * dy) * 111320; // rough meters
        const steps = Math.max(1, Math.floor(dist / spacing));
        for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            result.push([from.lon + dx * t, from.lat + dy * t]);
        }
    }
    return result;
}

export async function roadsRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/api/roads/:city',
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { city } = cityParamSchema.parse(request.params);
                const supabase = getSupabaseClient();

                // Check if we already have roads for this city
                const { data: existing } = await supabase
                    .from('road_networks')
                    .select('id')
                    .eq('city', city)
                    .limit(1);

                if (existing && existing.length > 0) {
                    // Return cached data
                    const { data: roads } = await supabase
                        .from('road_networks')
                        .select('*')
                        .eq('city', city);

                    return reply.send({
                        type: 'FeatureCollection',
                        features: (roads || []).map((road: any) => ({
                            type: 'Feature',
                            geometry: road.way,
                            properties: {
                                highway_type: road.highway_type,
                                interpolated_points: road.interpolated_points,
                            },
                        })),
                    });
                }

                // Fetch from Overpass API
                const query = buildOverpassQuery(city);
                const response = await axios.post(OVERPASS_URL, `data=${encodeURIComponent(query)}`, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    timeout: 30000,
                });

                const elements = response.data.elements || [];
                const ways = elements.filter((el: any) => el.type === 'way' && el.geometry);

                // Store in database
                for (const way of ways) {
                    const coords = way.geometry.map((g: any) => [g.lon, g.lat]);
                    const interpolated = interpolateCoordinates(way.geometry);

                    await supabase.from('road_networks').insert({
                        city,
                        way: {
                            type: 'LineString',
                            coordinates: coords,
                        },
                        highway_type: way.tags?.highway || 'unknown',
                        interpolated_points: interpolated,
                    });
                }

                return reply.send({
                    type: 'FeatureCollection',
                    features: ways.map((way: any) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: way.geometry.map((g: any) => [g.lon, g.lat]),
                        },
                        properties: {
                            highway_type: way.tags?.highway,
                        },
                    })),
                    count: ways.length,
                });
            } catch (error: any) {
                fastify.log.error({ error: error.message }, 'Roads API failed');
                return reply.status(500).send({
                    error: 'Failed to fetch road data',
                    message: error.message,
                });
            }
        }
    );
}
