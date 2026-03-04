/**
 * Historical Position Recording — Periodically saves current flight/ship/satellite
 * positions for 4D historical playback via CZML.
 */
import { getSupabaseClient } from '../config/supabase';

// In-memory cache of latest broadcast data for snapshotting
let latestCivilianFlights: any[] = [];
let latestMilitaryFlights: any[] = [];
let latestShips: any[] = [];

export function setLatestCivilianFlights(flights: any[]) {
    latestCivilianFlights = flights;
}

export function setLatestMilitaryFlights(flights: any[]) {
    latestMilitaryFlights = flights;
}

export function setLatestShips(ships: any[]) {
    latestShips = ships;
}

export async function recordHistoricalPositions(): Promise<void> {
    try {
        const supabase = getSupabaseClient();
        const now = new Date().toISOString();
        const positions: any[] = [];

        // Record civilian flights
        for (const flight of latestCivilianFlights.slice(0, 500)) { // Limit per snapshot
            positions.push({
                entity_type: 'flight',
                entity_id: flight.icao24,
                lat: flight.lat,
                lon: flight.lon,
                alt: flight.alt,
                heading: flight.heading,
                speed: flight.velocity || flight.speed,
                metadata: { callsign: flight.callsign, origin_country: flight.origin_country },
                recorded_at: now,
            });
        }

        // Record military flights
        for (const flight of latestMilitaryFlights.slice(0, 200)) {
            positions.push({
                entity_type: 'military',
                entity_id: flight.icao24,
                lat: flight.lat,
                lon: flight.lon,
                alt: flight.alt,
                heading: flight.track || flight.heading,
                speed: flight.speed,
                metadata: { callsign: flight.callsign, type: flight.type },
                recorded_at: now,
            });
        }

        // Record ships
        for (const ship of latestShips.slice(0, 200)) {
            positions.push({
                entity_type: 'ship',
                entity_id: ship.mmsi,
                lat: ship.lat,
                lon: ship.lon,
                alt: 0,
                heading: ship.heading,
                speed: ship.speed,
                metadata: { name: ship.name, shipType: ship.shipType, destination: ship.destination },
                recorded_at: now,
            });
        }

        if (positions.length > 0) {
            const { error } = await supabase
                .from('historical_positions')
                .insert(positions);

            if (error) {
                console.error('[Historical] Insert failed:', error.message);
            } else {
                console.log(`[Historical] Recorded ${positions.length} positions`);
            }
        }

        // Clean up old historical data (keep last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        await supabase
            .from('historical_positions')
            .delete()
            .lt('recorded_at', oneDayAgo);

    } catch (error: any) {
        console.error('[Historical] Recording failed:', error.message);
    }
}
