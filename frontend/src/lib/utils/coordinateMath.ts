// Coordinate math utilities

const EARTH_RADIUS_M = 6371000;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export function toRadians(degrees: number): number {
    return degrees * DEG_TO_RAD;
}

export function toDegrees(radians: number): number {
    return radians * RAD_TO_DEG;
}

export function haversineDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function bearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = toRadians(lon2 - lon1);
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
        Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    return ((toDegrees(Math.atan2(y, x)) + 360) % 360);
}

export function midpoint(lat1: number, lon1: number, lat2: number, lon2: number): { lat: number; lon: number } {
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const dLon = toRadians(lon2 - lon1);
    const bx = Math.cos(lat2Rad) * Math.cos(dLon);
    const by = Math.cos(lat2Rad) * Math.sin(dLon);
    const lat = Math.atan2(
        Math.sin(lat1Rad) + Math.sin(lat2Rad),
        Math.sqrt((Math.cos(lat1Rad) + bx) ** 2 + by ** 2)
    );
    const lon = toRadians(lon1) + Math.atan2(by, Math.cos(lat1Rad) + bx);
    return { lat: toDegrees(lat), lon: toDegrees(lon) };
}

export function interpolatePoints(
    coords: [number, number][],
    numPoints: number
): [number, number][] {
    if (coords.length < 2 || numPoints <= coords.length) return coords;

    const result: [number, number][] = [];
    const totalDist = coords.reduce((sum, coord, i) => {
        if (i === 0) return 0;
        return sum + haversineDistance(coords[i - 1][1], coords[i - 1][0], coord[1], coord[0]);
    }, 0);

    const segmentDist = totalDist / (numPoints - 1);

    let accumulated = 0;
    let segIdx = 0;
    result.push(coords[0]);

    for (let i = 1; i < numPoints - 1; i++) {
        const target = segmentDist * i;
        while (segIdx < coords.length - 2) {
            const segLen = haversineDistance(
                coords[segIdx][1], coords[segIdx][0],
                coords[segIdx + 1][1], coords[segIdx + 1][0]
            );
            if (accumulated + segLen >= target) {
                const t = (target - accumulated) / segLen;
                const lon = coords[segIdx][0] + t * (coords[segIdx + 1][0] - coords[segIdx][0]);
                const lat = coords[segIdx][1] + t * (coords[segIdx + 1][1] - coords[segIdx][1]);
                result.push([lon, lat]);
                break;
            }
            accumulated += segLen;
            segIdx++;
        }
    }

    result.push(coords[coords.length - 1]);
    return result;
}

export function formatCoordinate(degrees: number, type: 'lat' | 'lon'): string {
    const dir = type === 'lat' ? (degrees >= 0 ? 'N' : 'S') : (degrees >= 0 ? 'E' : 'W');
    const abs = Math.abs(degrees);
    const deg = Math.floor(abs);
    const min = ((abs - deg) * 60).toFixed(3);
    return `${deg}°${min}'${dir}`;
}
