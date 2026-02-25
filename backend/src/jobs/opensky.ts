import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getSupabaseClient } from '../config/supabase';
import { openskyPollsTotal, activeFlightsGauge } from '../routes/metrics';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Configure retry
const client = axios.create({ timeout: 15000 });
axiosRetry(client, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

interface FlightState {
    icao24: string;
    callsign: string;
    origin_country: string;
    lon: number;
    lat: number;
    alt: number;
    velocity: number;
    heading: number;
    vertical_rate: number;
    on_ground: boolean;
    last_contact: number;
}

// Global channel to prevent reconnect spam and REST fallback warnings
let civilianChannel: RealtimeChannel | null = null;

function getCivilianChannel() {
    if (!civilianChannel) {
        const supabase = getSupabaseClient();
        civilianChannel = supabase.channel('flights:civilian');
        civilianChannel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('[Civilian] Subscribed to flights:civilian realtime channel');
            }
        });
    }
    return civilianChannel;
}

const GLOBAL_HUBS = [
    { lat: 40.71, lon: -74.00, label: 'New York' },
    { lat: 51.50, lon: -0.12, label: 'London' },
    { lat: 35.67, lon: 139.65, label: 'Tokyo' },
    { lat: 48.85, lon: 2.35, label: 'Paris' },
    { lat: 38.90, lon: -77.03, label: 'Washington DC' }
];

function normalizeAdsbLol(ac: any): FlightState {
    return {
        icao24: ac.hex || ac.icao || '',
        callsign: (ac.flight || ac.callsign || '').trim(),
        origin_country: 'Unknown',
        lon: Number(ac.lon ?? 0),
        lat: Number(ac.lat ?? 0),
        alt: ac.alt_baro === 'ground' ? 0 : Number(ac.alt_baro ?? ac.alt ?? 0),
        velocity: Number(ac.gs ?? ac.speed ?? 0),
        heading: Number(ac.track ?? ac.heading ?? 0),
        vertical_rate: Number(ac.baro_rate ?? 0),
        on_ground: false,
        last_contact: Math.floor(Date.now() / 1000)
    };
}

export async function pollOpenSky(): Promise<void> {
    const allFlights: FlightState[] = [];

    // Fetch from ADSB.lol for real civilian flights since OpenSky IP bans data centers
    for (const hub of GLOBAL_HUBS) {
        try {
            const response = await client.get(`https://api.adsb.lol/v2/point/${hub.lat}/${hub.lon}/250`, {
                headers: { Accept: 'application/json' },
            });

            const aircraft = response.data?.ac || response.data?.aircraft || [];
            const civilian = aircraft
                .filter((a: any) => !(a.mil === true || a.military === true || a.dbFlags === 1))
                .map(normalizeAdsbLol)
                .filter((f: FlightState) => f.lat !== 0 && f.lon !== 0);

            allFlights.push(...civilian);
        } catch (error: any) {
            console.error(`[Civilian] Poll failed for ${hub.label}:`, error.message);
        }
    }

    if (allFlights.length > 0) {
        try {
            // Deduplicate by icao24
            const unique = Array.from(new Map(allFlights.map(f => [f.icao24, f])).values());

            const channel = getCivilianChannel();
            if (channel) {
                await channel.send({
                    type: 'broadcast',
                    event: 'update',
                    payload: unique,
                });
            }

            activeFlightsGauge.set({ type: 'civilian' }, unique.length);
            openskyPollsTotal.inc({ status: 'success' });
            console.log(`[Civilian] Broadcast ${unique.length} live flights (via adsb.lol fallback)`);
        } catch (error: any) {
            openskyPollsTotal.inc({ status: 'error' });
            console.error('[Civilian] Broadcast failed:', error.message);
        }
    } else {
        openskyPollsTotal.inc({ status: 'empty' });
        console.log('[Civilian] No civilian flights retrieved this poll.');
    }
}
