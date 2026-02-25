// API response types

export interface HealthResponse {
    status: 'ok' | 'degraded' | 'down';
    uptime: number;
    timestamp: string;
    version: string;
}

export interface ErrorResponse {
    error: string;
    code?: string;
    statusCode: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export interface OpenSkyState {
    icao24: string;
    callsign: string | null;
    origin_country: string;
    time_position: number;
    last_contact: number;
    longitude: number | null;
    latitude: number | null;
    baro_altitude: number | null;
    on_ground: boolean;
    velocity: number | null;
    true_track: number | null;
    vertical_rate: number | null;
    geo_altitude: number | null;
}

export interface ADSBExchangeAircraft {
    hex: string;
    type: string;
    flight: string;
    alt_baro: number;
    alt_geom: number;
    gs: number;
    track: number;
    lat: number;
    lon: number;
    military: boolean;
}

export interface OverpassResponse {
    elements: Array<{
        type: 'way' | 'node';
        id: number;
        nodes?: number[];
        geometry?: Array<{ lat: number; lon: number }>;
        tags?: Record<string, string>;
    }>;
}
