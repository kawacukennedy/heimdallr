import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getSupabaseClient } from '../config/supabase';
import { env } from '../config/env';
import { openskyPollsTotal, activeFlightsGauge } from '../routes/metrics';

// Configure retry logic
const client = axios.create({ timeout: 20000 });
axiosRetry(client, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

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

function normalizeOpenSkyState(state: any[]): FlightState {
    return {
        icao24: state[0] || '',
        callsign: (state[1] || '').trim(),
        origin_country: state[2] || '',
        lon: state[5] ?? 0,
        lat: state[6] ?? 0,
        alt: state[7] ?? 0, // geometric altitude in meters
        velocity: state[9] ?? 0, // ground speed m/s
        heading: state[10] ?? 0, // track angle degrees
        vertical_rate: state[11] ?? 0,
        on_ground: state[8] ?? false,
        last_contact: state[4] ?? 0,
    };
}

export async function pollOpenSky(): Promise<void> {
    try {
        const params: Record<string, any> = {};

        // Use authentication if available for higher rate limits
        const auth =
            env.OPENSKY_USERNAME && env.OPENSKY_PASSWORD
                ? { username: env.OPENSKY_USERNAME, password: env.OPENSKY_PASSWORD }
                : undefined;

        const response = await client.get('https://opensky-network.org/api/states/all', {
            params,
            auth,
            timeout: 20000,
        });

        if (!response.data?.states) {
            console.log('[OpenSky] No flight states returned');
            openskyPollsTotal.inc({ status: 'empty' });
            return;
        }

        const normalized: FlightState[] = response.data.states
            .map(normalizeOpenSkyState)
            .filter((f: FlightState) => f.lat !== 0 && f.lon !== 0 && !f.on_ground);

        // Broadcast to Supabase Realtime
        const supabase = getSupabaseClient();
        const channel = supabase.channel('flights:civilian');

        await channel.send({
            type: 'broadcast',
            event: 'update',
            payload: normalized,
        });

        activeFlightsGauge.set({ type: 'civilian' }, normalized.length);
        openskyPollsTotal.inc({ status: 'success' });
        console.log(`[OpenSky] Broadcast ${normalized.length} civilian flights`);
    } catch (error: any) {
        openskyPollsTotal.inc({ status: 'error' });
        console.error('[OpenSky] Poll failed:', error.message);
    }
}
