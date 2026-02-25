// Dead Reckoning Worker
// Interpolates flight positions between 5-second real-time updates
// Uses linear extrapolation from last known position + velocity + heading

interface FlightState {
    icao24: string;
    lat: number;
    lon: number;
    alt: number;
    velocity: number; // m/s
    heading: number; // degrees
    timestamp: number; // ms
}

const flightStates = new Map<string, FlightState>();

function toRadians(deg: number): number {
    return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
    return (rad * 180) / Math.PI;
}

/**
 * Extrapolate a position forward in time using great-circle dead reckoning
 */
function extrapolate(state: FlightState, dtSeconds: number): { lat: number; lon: number; alt: number } {
    const distanceM = state.velocity * dtSeconds;
    const R = 6371000; // Earth radius in meters
    const angularDistance = distanceM / R;

    const lat1 = toRadians(state.lat);
    const lon1 = toRadians(state.lon);
    const bearing = toRadians(state.heading);

    const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance) +
        Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lon2 =
        lon1 +
        Math.atan2(
            Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
            Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
        );

    return {
        lat: toDegrees(lat2),
        lon: toDegrees(lon2),
        alt: state.alt, // Altitude assumed constant between updates
    };
}

self.onmessage = (e: MessageEvent) => {
    const { type } = e.data;

    if (type === 'update') {
        // Batch update of flight states from real-time feed
        const flights: FlightState[] = e.data.flights;
        for (const flight of flights) {
            flightStates.set(flight.icao24, { ...flight, timestamp: Date.now() });
        }
        self.postMessage({ type: 'updated', count: flightStates.size });
    }

    if (type === 'interpolate') {
        // Compute dead-reckoned positions for all tracked flights
        const now = Date.now();
        const positions: Array<{ icao24: string; lat: number; lon: number; alt: number }> = [];

        flightStates.forEach((state, icao24) => {
            const dtSeconds = (now - state.timestamp) / 1000;

            // Don't extrapolate more than 30 seconds
            if (dtSeconds > 30) return;

            const pos = extrapolate(state, dtSeconds);
            positions.push({ icao24, ...pos });
        });

        self.postMessage({ type: 'positions', positions });
    }

    if (type === 'remove') {
        // Remove stale flights
        const staleIds: string[] = e.data.ids;
        for (const id of staleIds) {
            flightStates.delete(id);
        }
    }

    if (type === 'clear') {
        flightStates.clear();
    }
};
