// SGP4 Satellite Propagation Worker
// Runs in a Web Worker to avoid blocking the main thread
// Uses satellite.js for orbital mechanics calculations

import {
    propagate,
    twoline2satrec,
    eciToGeodetic,
    gstime,
    degreesLong,
    degreesLat,
} from 'satellite.js';

interface TLEData {
    id: string;
    name: string;
    line1: string;
    line2: string;
}

interface SatelliteRecord {
    id: string;
    name: string;
    satrec: ReturnType<typeof twoline2satrec>;
    orbitType: 'LEO' | 'MEO' | 'GEO';
}

interface SatellitePosition {
    id: string;
    name: string;
    lon: number;
    lat: number;
    height: number; // km
    orbitType: 'LEO' | 'MEO' | 'GEO';
}

let satellites: SatelliteRecord[] = [];

function classifyOrbit(meanMotionRevPerDay: number): 'LEO' | 'MEO' | 'GEO' {
    // Mean motion > 11.25 rev/day ≈ LEO, between 2-11.25 ≈ MEO, ~1 ≈ GEO
    if (meanMotionRevPerDay > 11.25) return 'LEO';
    if (meanMotionRevPerDay > 2) return 'MEO';
    return 'GEO';
}

self.onmessage = (e: MessageEvent) => {
    const { type } = e.data;

    if (type === 'init') {
        const tles: TLEData[] = e.data.tles;
        satellites = [];

        for (const tle of tles) {
            try {
                const satrec = twoline2satrec(tle.line1, tle.line2);
                const meanMotion = satrec.no * (1440 / (2 * Math.PI)); // rad/min to rev/day
                satellites.push({
                    id: tle.id,
                    name: tle.name,
                    satrec,
                    orbitType: classifyOrbit(meanMotion),
                });
            } catch {
                // Skip invalid TLEs
            }
        }

        self.postMessage({ type: 'initialized', count: satellites.length });
    }

    if (type === 'tick') {
        const date = new Date(e.data.time);
        const gmst = gstime(date);
        const positions: SatellitePosition[] = [];

        for (const sat of satellites) {
            try {
                const positionAndVelocity = propagate(sat.satrec, date);
                const positionEci = positionAndVelocity.position;

                if (typeof positionEci === 'boolean' || !positionEci) continue;

                const positionGd = eciToGeodetic(positionEci, gmst);

                positions.push({
                    id: sat.id,
                    name: sat.name,
                    lon: degreesLong(positionGd.longitude),
                    lat: degreesLat(positionGd.latitude),
                    height: positionGd.height, // km
                    orbitType: sat.orbitType,
                });
            } catch {
                // Skip propagation failures
            }
        }

        self.postMessage({ type: 'result', positions });
    }
};
