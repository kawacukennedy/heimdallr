// API endpoint configuration

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'https://heimdallr-backend.onrender.com' : 'http://localhost:3001');

export const API_ENDPOINTS = {
    // Backend endpoints
    HEALTH: `${BACKEND_URL}/health`,
    CCTV_PROXY: `${BACKEND_URL}/proxy/cctv`,
    ROADS: (city: string) => `${BACKEND_URL}/api/roads/${encodeURIComponent(city)}`,
    METRICS: `${BACKEND_URL}/metrics`,

    // Auth
    LOGIN: `${BACKEND_URL}/auth/login`,
    REGISTER: `${BACKEND_URL}/auth/register`,
    LOGOUT: `${BACKEND_URL}/auth/logout`,

    // External (used by workers or direct fetch)
    OPENSKY: 'https://opensky-network.org/api/states/all',
    CELESTRAK:
        'https://celestrak.com/NORAD/elements/gp.php?GROUP=active&FORMAT=tle',
    NOMINATIM: (query: string) =>
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
} as const;
