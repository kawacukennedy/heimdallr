// Geocoding service
import { API_ENDPOINTS } from '@/lib/constants/apiEndpoints';

export interface GeocodingResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    importance: number;
}

export async function geocode(query: string, limit = 5): Promise<GeocodingResult[]> {
    const url = API_ENDPOINTS.NOMINATIM(query);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding failed');
    return res.json();
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
}
