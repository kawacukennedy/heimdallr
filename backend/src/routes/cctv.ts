import { FastifyInstance } from 'fastify';
import axios from 'axios';
import { getSupabaseClient } from '../config/supabase';

interface TrafficCamera {
    Id: number;
    Description: string;
    Latitude: number;
    Longitude: number;
    ImageURL: string;
    Roadway: string;
    Direction: string;
}

export async function cctvRoutes(fastify: FastifyInstance) {
    // GET /api/cctv — all cameras from database + live feeds
    fastify.get('/api/cctv', async (_request, reply) => {
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('cctv_cameras')
            .select('id, location, source_url, heading, pitch, city, label')
            .order('city');

        if (error) {
            return reply.status(500).send({ error: error.message });
        }

        return reply.send(data || []);
    });

    // GET /api/cctv/live — fetch live traffic cameras from public APIs
    fastify.get('/api/cctv/live', async (_request, reply) => {
        const cameras: any[] = [];

        // Fetch from Ontario 511 API (free, public)
        try {
            const ontarioRes = await axios.get('https://511on.ca/api/v2/get/cameras?format=json', {
                timeout: 15000,
            });
            
            const ontarioCameras: TrafficCamera[] = ontarioRes.data || [];
            
            ontarioCameras.forEach((cam: TrafficCamera) => {
                if (cam.Latitude && cam.Longitude) {
                    cameras.push({
                        id: `ontario-${cam.Id}`,
                        lat: cam.Latitude,
                        lon: cam.Longitude,
                        source_url: cam.ImageURL,
                        heading: cam.Direction === 'E' ? 90 : cam.Direction === 'W' ? 270 : cam.Direction === 'N' ? 0 : 180,
                        pitch: -15,
                        city: 'Ontario',
                        label: cam.Description || cam.Roadway,
                    });
                }
            });
        } catch (e) {
            console.error('Ontario 511 fetch failed:', e);
        }

        // Try Texas DOT cameras as backup
        try {
            const texasRes = await axios.get('https://public-api.tntraffic.com/trafficCameras/v1/texas', {
                timeout: 15000,
                headers: { 'Accept': 'application/json' }
            });
            
            const texasCameras = texasRes.data?.cameras || [];
            
            texasCameras.forEach((cam: any) => {
                if (cam.lat && cam.lng) {
                    cameras.push({
                        id: `texas-${cam.id}`,
                        lat: cam.lat,
                        lon: cam.lng,
                        source_url: cam.imageUrl,
                        heading: 0,
                        pitch: -15,
                        city: 'Texas',
                        label: cam.name || cam.location,
                    });
                }
            });
        } catch (e) {
            // Texas API failed, that's ok
        }

        return reply.send(cameras);
    });

    // GET /api/cctv/:city — cameras by city
    fastify.get<{ Params: { city: string } }>('/api/cctv/:city', async (request, reply) => {
        const { city } = request.params;
        const supabase = getSupabaseClient();

        const { data, error } = await supabase
            .from('cctv_cameras')
            .select('id, location, source_url, heading, pitch, city, label')
            .ilike('city', `%${city}%`);

        if (error) {
            return reply.status(500).send({ error: error.message });
        }

        return reply.send(data || []);
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
                const { data: fallback, error: fallbackErr } = await supabase
                    .from('cctv_cameras')
                    .select('*');

                if (fallbackErr) return reply.status(500).send({ error: fallbackErr.message });
                return reply.send(fallback || []);
            }

            return reply.send(data || []);
        }
    );
}
