import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getSupabaseClient } from '../config/supabase';
import { env } from '../config/env';
import { adsbxPollsTotal, activeFlightsGauge } from '../routes/metrics';

const client = axios.create({ timeout: 10000 });
axiosRetry(client, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

interface MilitaryFlight {
    icao24: string;
    callsign: string;
    lat: number;
    lon: number;
    alt: number;
    speed: number;
    track: number;
    type: string;
    squawk: string;
    emergency: string;
    category: string;
}

// Strategic monitoring points
const MONITORING_COORDS = [
    { lat: 40, lon: -74, label: 'New York' },
    { lat: 51, lon: -0.1, label: 'London' },
    { lat: 35, lon: 139, label: 'Tokyo' },
    { lat: 38.9, lon: -77, label: 'Washington DC' },
    { lat: 48.8, lon: 2.3, label: 'Paris' },
];

function normalizeADSBFlight(aircraft: any): MilitaryFlight {
    return {
        icao24: aircraft.hex || aircraft.icao || '',
        callsign: (aircraft.flight || aircraft.callsign || '').trim(),
        lat: aircraft.lat ?? 0,
        lon: aircraft.lon ?? 0,
        alt: aircraft.alt_baro ?? aircraft.alt ?? 0,
        speed: aircraft.gs ?? aircraft.speed ?? 0,
        track: aircraft.track ?? aircraft.heading ?? 0,
        type: aircraft.t ?? aircraft.type ?? 'unknown',
        squawk: aircraft.squawk ?? '',
        emergency: aircraft.emergency ?? 'none',
        category: aircraft.category ?? '',
    };
}

export async function pollADSBExchange(): Promise<void> {
    if (!env.ADSBX_API_KEY) {
        console.log('[ADS-B] No API key configured, skipping');
        return;
    }

    const allMilitary: MilitaryFlight[] = [];

    for (const coord of MONITORING_COORDS) {
        try {
            const response = await client.get(
                `https://adsbexchange.com/api/aircraft/json/lat/${coord.lat}/lon/${coord.lon}/dist/250/`,
                {
                    headers: {
                        'api-auth': env.ADSBX_API_KEY,
                        Accept: 'application/json',
                    },
                    timeout: 10000,
                }
            );

            const aircraft = response.data?.ac || response.data?.aircraft || [];
            const military = aircraft
                .filter((a: any) => a.mil === true || a.military === true || a.dbFlags === 1)
                .map(normalizeADSBFlight)
                .filter((f: MilitaryFlight) => f.lat !== 0 && f.lon !== 0);

            allMilitary.push(...military);
        } catch (error: any) {
            console.error(`[ADS-B] Poll failed for ${coord.label}:`, error.message);
        }
    }

    if (allMilitary.length > 0) {
        try {
            // Deduplicate by icao24
            const unique = Array.from(
                new Map(allMilitary.map((f) => [f.icao24, f])).values()
            );

            const supabase = getSupabaseClient();
            const channel = supabase.channel('flights:military');

            await channel.send({
                type: 'broadcast',
                event: 'update',
                payload: unique,
            });

            activeFlightsGauge.set({ type: 'military' }, unique.length);
            adsbxPollsTotal.inc({ status: 'success' });
            console.log(`[ADS-B] Broadcast ${unique.length} military flights`);
        } catch (error: any) {
            adsbxPollsTotal.inc({ status: 'error' });
            console.error('[ADS-B] Broadcast failed:', error.message);
        }
    } else {
        adsbxPollsTotal.inc({ status: 'empty' });
    }
}
