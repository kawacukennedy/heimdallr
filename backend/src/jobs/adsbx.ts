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

// Fetching globally now from adsb.lol instead of chunking locations

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
    const allMilitary: MilitaryFlight[] = [];

    try {
        const response = await client.get(
            `https://api.adsb.lol/v2/mil`,
            {
                headers: {
                    Accept: 'application/json',
                },
                timeout: 10000,
            }
        );

        const aircraft = response.data?.ac || response.data?.aircraft || [];
        const military = aircraft
            .map(normalizeADSBFlight)
            .filter((f: MilitaryFlight) => f.lat !== 0 && f.lon !== 0);

        allMilitary.push(...military);
    } catch (error: any) {
        console.error(`[ADS-B] Poll failed:`, error.message);
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
