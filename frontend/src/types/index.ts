// Global TypeScript interfaces for Heimdallr

// ======== Entity Types ========

export interface FlightData {
    icao24: string;
    callsign: string;
    origin_country: string;
    lat: number;
    lon: number;
    alt: number;
    velocity: number;
    heading: number;
    vertical_rate: number;
    on_ground: boolean;
    last_contact: number;
}

export interface MilitaryFlightData {
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

export interface SatelliteData {
    id: string;
    name: string;
    line1: string;
    line2: string;
    lat?: number;
    lon?: number;
    height?: number;
    orbitType?: 'LEO' | 'MEO' | 'GEO' | 'HEO';
    period?: number;
}

export interface CCTVCamera {
    id: string;
    lat: number;
    lon: number;
    source_url: string;
    heading: number;
    pitch: number;
    city?: string;
    label?: string;
}

export interface RoadNetwork {
    id: string;
    city: string;
    coordinates: [number, number][];
    highway_type: string;
    interpolated_points: [number, number][];
}

export interface ShipData {
    mmsi: string;
    name: string;
    shipType: string;
    lat: number;
    lon: number;
    heading: number;
    speed: number;
    course: number;
    destination: string;
    flag: string;
    length: number;
    width: number;
    aisTimestamp: number;
}

export interface GpsJammingZone {
    id?: string;
    centerLat: number;
    centerLon: number;
    radiusDeg: number;
    severity: number;
    affectedAircraft: number;
    avgNacp: number;
    avgNic: number;
    bounds: number[][];
    active?: boolean;
}

export interface SatelliteFootprint {
    satId: string;
    satName: string;
    subPointLat: number;
    subPointLon: number;
    altitude: number;
    footprintRadiusKm: number;
    footprintBounds: number[][];
    targetInView: boolean;
    targetName?: string;
    targetLat?: number;
    targetLon?: number;
}

// ======== Camera ========

export interface CameraPosition {
    longitude: number;
    latitude: number;
    height: number;
    heading?: number;
    pitch?: number;
    roll?: number;
}

export interface Bookmark {
    name: string;
    camera: CameraPosition;
    icon?: string;
}

// ======== UI State ========

export type LayerKey = 'civilian' | 'military' | 'satellites' | 'cctv' | 'traffic' | 'ships' | 'gpsJamming';

export type ShaderPreset = 'standard' | 'nightVision' | 'thermal' | 'crt' | 'edgeDetection';

export type EntityType = 'flight' | 'military' | 'satellite' | 'cctv' | 'ship' | null;

export interface SelectedEntity {
    id: string;
    type: EntityType;
    data: FlightData | MilitaryFlightData | SatelliteData | CCTVCamera | null;
}

// ======== Settings ========

export interface AppSettings {
    units: 'metric' | 'imperial';
    updateInterval: number;
    showFPS: boolean;
    language: string;
}

export interface ShaderSettings {
    bloomIntensity: number;
    scanlineIntensity: number;
    noiseAmount: number;
    chromaticAberration: number;
    thermalPalette: 'Ironbow' | 'Rainbow' | 'Grayscale';
}

// ======== API Types ========

export interface HealthResponse {
    status: string;
    timestamp: string;
    uptime: number;
}

export interface GeocodingResult {
    display_name: string;
    lat: string;
    lon: string;
    type: string;
}

export interface SearchResult {
    id: string;
    name: string;
    category: 'location' | 'flight' | 'satellite';
    lat: number;
    lon: number;
    data?: any;
}

// ======== Realtime ========

export interface RealtimePayload<T = any> {
    type: string;
    event: string;
    payload: T;
}

// ======== TLE ========

export interface TLEEntry {
    id: string;
    name: string;
    line1: string;
    line2: string;
}

export interface TLESnapshot {
    id: string;
    fetched_at: string;
    tle_data: TLEEntry[];
}

// ======== Worker Messages ========

export interface SGP4WorkerInit {
    type: 'init';
    tles: TLEEntry[];
}

export interface SGP4WorkerTick {
    type: 'tick';
    time: string;
}

export interface SGP4WorkerResult {
    type: 'result';
    positions: Array<{
        id: string;
        lon: number;
        lat: number;
        height: number;
    }>;
}

export type SGP4WorkerMessage = SGP4WorkerInit | SGP4WorkerTick;
