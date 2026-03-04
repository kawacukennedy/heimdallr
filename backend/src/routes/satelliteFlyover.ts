/**
 * Satellite Flyover Route — Calculates satellite sub-points, footprints,
 * and target correlation for ground-correlation visualization.
 */
import { FastifyInstance } from 'fastify';
import { getSupabaseClient } from '../config/supabase';

interface SatelliteFootprint {
    satId: string;
    satName: string;
    subPointLat: number;
    subPointLon: number;
    altitude: number;
    footprintRadiusKm: number;
    footprintBounds: number[][];
    targetInView: boolean;
    targetName?: string;
    targetLat?: number;
    targetLon?: number;
}

/** Points of interest to correlate with satellite overpasses. */
const TARGETS_OF_INTEREST = [
    { name: 'Natanz Nuclear Facility', lat: 33.7240, lon: 51.7270 },
    { name: 'Baikonur Cosmodrome', lat: 45.9650, lon: 63.3050 },
    { name: 'Cape Canaveral', lat: 28.3922, lon: -80.6077 },
    { name: 'Jiuquan Launch Center', lat: 40.9606, lon: 100.2910 },
    { name: 'Strait of Hormuz', lat: 26.5667, lon: 56.2500 },
    { name: 'DMZ Korea', lat: 37.9500, lon: 126.6500 },
    { name: 'Diego Garcia', lat: -7.3195, lon: 72.4229 },
    { name: 'Guam', lat: 13.4443, lon: 144.7937 },
    { name: 'Ramstein AFB', lat: 49.4369, lon: 7.6003 },
    { name: 'Incirlik AFB', lat: 37.0022, lon: 35.4257 },
];

/**
 * Calculate satellite footprint radius based on altitude.
 * Uses simplified geometry (Earth radius + satellite altitude → horizon angle).
 */
function calculateFootprintRadius(altitudeKm: number): number {
    const earthRadiusKm = 6371;
    const horizonAngle = Math.acos(earthRadiusKm / (earthRadiusKm + altitudeKm));
    return earthRadiusKm * horizonAngle; // Arc length ≈ footprint radius
}

/**
 * Check if a target is within a satellite's footprint.
 */
function isTargetInView(
    satLat: number, satLon: number,
    targetLat: number, targetLon: number,
    footprintRadiusKm: number
): boolean {
    const R = 6371;
    const dLat = (targetLat - satLat) * Math.PI / 180;
    const dLon = (targetLon - satLon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(satLat * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= footprintRadiusKm;
}

/**
 * Generate footprint polygon (circle approximation on the globe).
 */
function generateFootprintPolygon(
    centerLat: number, centerLon: number,
    radiusKm: number, segments = 36
): number[][] {
    const R = 6371;
    const coords: number[][] = [];
    for (let i = 0; i <= segments; i++) {
        const bearing = (i / segments) * 2 * Math.PI;
        const latRad = Math.asin(
            Math.sin(centerLat * Math.PI / 180) * Math.cos(radiusKm / R) +
            Math.cos(centerLat * Math.PI / 180) * Math.sin(radiusKm / R) * Math.cos(bearing)
        );
        const lonRad = (centerLon * Math.PI / 180) + Math.atan2(
            Math.sin(bearing) * Math.sin(radiusKm / R) * Math.cos(centerLat * Math.PI / 180),
            Math.cos(radiusKm / R) - Math.sin(centerLat * Math.PI / 180) * Math.sin(latRad)
        );
        coords.push([lonRad * 180 / Math.PI, latRad * 180 / Math.PI]);
    }
    return coords;
}

export async function satelliteFlyoverRoutes(fastify: FastifyInstance) {
    // GET /api/satellite-flyover — calculate satellite footprints and target correlations
    fastify.get<{
        Querystring: {
            satellites?: string; // JSON array of { id, name, lat, lon, altitude }
        };
    }>('/api/satellite-flyover', async (request, reply) => {
        try {
            const satellitesParam = request.query.satellites;
            let satellites: any[] = [];

            if (satellitesParam) {
                satellites = JSON.parse(satellitesParam);
            }

            const footprints: SatelliteFootprint[] = [];

            for (const sat of satellites) {
                const altKm = sat.altitude || sat.height || 400;
                const footprintRadiusKm = calculateFootprintRadius(altKm);
                const subPointLat = sat.lat;
                const subPointLon = sat.lon;

                // Check each target of interest
                let closestTarget: any = null;
                let closestDistance = Infinity;

                for (const target of TARGETS_OF_INTEREST) {
                    if (isTargetInView(subPointLat, subPointLon, target.lat, target.lon, footprintRadiusKm)) {
                        const dLat = target.lat - subPointLat;
                        const dLon = target.lon - subPointLon;
                        const dist = Math.sqrt(dLat ** 2 + dLon ** 2);
                        if (dist < closestDistance) {
                            closestDistance = dist;
                            closestTarget = target;
                        }
                    }
                }

                const polygon = generateFootprintPolygon(subPointLat, subPointLon, footprintRadiusKm);

                footprints.push({
                    satId: sat.id,
                    satName: sat.name,
                    subPointLat,
                    subPointLon,
                    altitude: altKm,
                    footprintRadiusKm,
                    footprintBounds: polygon,
                    targetInView: !!closestTarget,
                    targetName: closestTarget?.name,
                    targetLat: closestTarget?.lat,
                    targetLon: closestTarget?.lon,
                });
            }

            return reply.send({
                footprints,
                targetsOfInterest: TARGETS_OF_INTEREST,
            });
        } catch (error: any) {
            return reply.status(400).send({
                error: 'Invalid satellites parameter',
                message: error.message,
            });
        }
    });

    // GET /api/satellite-flyover/targets — list all targets of interest
    fastify.get('/api/satellite-flyover/targets', async (_request, reply) => {
        return reply.send(TARGETS_OF_INTEREST);
    });
}
