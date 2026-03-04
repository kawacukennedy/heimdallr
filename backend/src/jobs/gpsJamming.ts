/**
 * GPS Jamming Detection — Analyzes ADS-B data for navigation integrity degradation.
 * Monitors NIC/NACp drops and aggregates affected coordinates into jamming zones.
 */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getSupabaseClient } from '../config/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

const client = axios.create({ timeout: 15000 });
axiosRetry(client, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

interface AircraftWithNav {
    hex: string;
    lat: number;
    lon: number;
    alt: number;
    nac_p?: number;
    nac_v?: number;
    nic?: number;
    nic_baro?: number;
    sil?: number;
    gva?: number;
    sda?: number;
    nav_integrity?: number;
}

interface JammingZone {
    centerLat: number;
    centerLon: number;
    radiusDeg: number;
    severity: number;
    affectedAircraft: number;
    avgNacp: number;
    avgNic: number;
    bounds: number[][];
}

let jammingChannel: RealtimeChannel | null = null;

function getJammingChannel(): RealtimeChannel {
    if (!jammingChannel) {
        const supabase = getSupabaseClient();
        jammingChannel = supabase.channel('gps:jamming');
        jammingChannel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('[GPS-Jamming] Subscribed to gps:jamming realtime channel');
            }
        });
    }
    return jammingChannel;
}

// Grid size for spatial aggregation (in degrees)
const GRID_SIZE = 0.5;

function gridKey(lat: number, lon: number): string {
    const gridLat = Math.floor(lat / GRID_SIZE) * GRID_SIZE;
    const gridLon = Math.floor(lon / GRID_SIZE) * GRID_SIZE;
    return `${gridLat.toFixed(1)},${gridLon.toFixed(1)}`;
}

export async function detectGpsJamming(): Promise<void> {
    try {
        // Fetch aircraft with navigation quality data
        const response = await client.get('https://api.adsb.lol/v2/point/0/0/25000', {
            headers: { Accept: 'application/json' },
            timeout: 15000,
        });

        const aircraft: AircraftWithNav[] = (response.data?.ac || [])
            .filter((a: any) => a.lat && a.lon && (a.nac_p !== undefined || a.nic !== undefined));

        if (aircraft.length === 0) {
            console.log('[GPS-Jamming] No aircraft with NAV data found');
            return;
        }

        // Group aircraft by grid cell and check for degraded navigation
        const gridCells = new Map<string, AircraftWithNav[]>();

        for (const ac of aircraft) {
            const nacp = ac.nac_p ?? ac.nav_integrity ?? 10;
            const nic = ac.nic ?? 10;

            // NACp < 5 or NIC < 5 indicates potential GPS interference
            if (nacp < 5 || nic < 5) {
                const key = gridKey(ac.lat, ac.lon);
                if (!gridCells.has(key)) gridCells.set(key, []);
                gridCells.get(key)!.push(ac);
            }
        }

        // Identify jamming zones: grid cells with 2+ affected aircraft
        const jammingZones: JammingZone[] = [];

        for (const [key, affectedAc] of gridCells) {
            if (affectedAc.length >= 2) {
                const [latStr, lonStr] = key.split(',');
                const centerLat = parseFloat(latStr) + GRID_SIZE / 2;
                const centerLon = parseFloat(lonStr) + GRID_SIZE / 2;
                const avgNacp = affectedAc.reduce((sum, a) => sum + (a.nac_p ?? 0), 0) / affectedAc.length;
                const avgNic = affectedAc.reduce((sum, a) => sum + (a.nic ?? 0), 0) / affectedAc.length;
                const severity = Math.min(1, (5 - avgNacp) / 5);

                jammingZones.push({
                    centerLat,
                    centerLon,
                    radiusDeg: GRID_SIZE / 2,
                    severity,
                    affectedAircraft: affectedAc.length,
                    avgNacp,
                    avgNic,
                    bounds: [
                        [parseFloat(lonStr), parseFloat(latStr)],
                        [parseFloat(lonStr) + GRID_SIZE, parseFloat(latStr)],
                        [parseFloat(lonStr) + GRID_SIZE, parseFloat(latStr) + GRID_SIZE],
                        [parseFloat(lonStr), parseFloat(latStr) + GRID_SIZE],
                        [parseFloat(lonStr), parseFloat(latStr)], // close polygon
                    ],
                });
            }
        }

        // Store in database
        if (jammingZones.length > 0) {
            const supabase = getSupabaseClient();

            // Deactivate old zones
            await supabase
                .from('gps_jamming_zones')
                .update({ active: false })
                .eq('active', true);

            // Insert new zones
            for (const zone of jammingZones) {
                await supabase.from('gps_jamming_zones').insert({
                    bounds: { type: 'Polygon', coordinates: [zone.bounds] },
                    severity: zone.severity,
                    affected_aircraft: zone.affectedAircraft,
                    avg_nacp: zone.avgNacp,
                    avg_nic: zone.avgNic,
                    detected_at: new Date().toISOString(),
                    expires_at: new Date(Date.now() + 5 * 60000).toISOString(), // Expire in 5 minutes
                    active: true,
                });
            }

            // Broadcast to frontend
            const channel = getJammingChannel();
            if (channel) {
                await channel.send({
                    type: 'broadcast',
                    event: 'update',
                    payload: jammingZones,
                });
            }

            console.log(`[GPS-Jamming] Detected ${jammingZones.length} jamming zones, ${aircraft.length} aircraft analyzed`);
        } else {
            console.log(`[GPS-Jamming] No jamming detected, ${aircraft.length} aircraft analyzed`);
        }
    } catch (error: any) {
        console.error('[GPS-Jamming] Detection failed:', error.message);
    }
}
