// Realtime payload types for Supabase channels

export interface CivilianFlightPayload {
    icao24: string;
    callsign?: string;
    lat: number;
    lon: number;
    alt: number;
    velocity: number;
    heading: number;
    on_ground: boolean;
    last_contact: number;
}

export interface MilitaryFlightPayload {
    icao24: string;
    lat: number;
    lon: number;
    alt: number;
    speed: number;
    track: number;
    type: string;
}

export interface SatellitePayload {
    id: string;
    name: string;
    lon: number;
    lat: number;
    height: number;
    orbitType: 'LEO' | 'MEO' | 'GEO';
}

export interface CCTVPayload {
    id: string;
    lat: number;
    lon: number;
    source_url: string;
    heading: number;
    pitch: number;
    city: string;
    label?: string;
}
