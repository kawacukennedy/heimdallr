// CCTV proxy service
import { API_ENDPOINTS } from '@/lib/constants/apiEndpoints';
import { Cache } from '@/lib/utils/cache';

const imageCache = new Cache<string>(30000); // 30s TTL

export async function fetchCctvImage(sourceUrl: string): Promise<string> {
    const cached = imageCache.get(sourceUrl);
    if (cached) return cached;

    const proxyUrl = `${API_ENDPOINTS.CCTV_PROXY}?url=${encodeURIComponent(sourceUrl)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Failed to fetch CCTV image');

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    imageCache.set(sourceUrl, objectUrl);
    return objectUrl;
}

export function revokeCctvImage(objectUrl: string): void {
    URL.revokeObjectURL(objectUrl);
}
