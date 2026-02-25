// API service layer

import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/constants/apiEndpoints';
import type { CCTVCamera, RoadNetwork, TLESnapshot, HealthResponse } from '@/types';

const api = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// ---- Health ----
export async function checkBackendHealth(): Promise<HealthResponse> {
    const { data } = await api.get(API_ENDPOINTS.HEALTH);
    return data;
}

// ---- CCTV ----
export async function fetchCctvImage(sourceUrl: string): Promise<string> {
    const url = `${API_ENDPOINTS.CCTV_PROXY}?url=${encodeURIComponent(sourceUrl)}`;
    const { data } = await api.get(url, { responseType: 'blob' });
    return URL.createObjectURL(data);
}

// ---- Roads ----
export async function fetchRoads(city: string): Promise<RoadNetwork[]> {
    const { data } = await api.get(API_ENDPOINTS.ROADS(city));
    return data;
}

// ---- Auth ----
export async function login(email: string, password: string) {
    const { data } = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    return data;
}

export async function register(email: string, password: string) {
    const { data } = await api.post(API_ENDPOINTS.REGISTER, { email, password });
    return data;
}

export async function logout(token: string) {
    const { data } = await api.post(
        API_ENDPOINTS.LOGOUT,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
}

// ---- Geocoding ----
export async function geocode(query: string) {
    const res = await fetch(API_ENDPOINTS.NOMINATIM(query));
    return res.json();
}
