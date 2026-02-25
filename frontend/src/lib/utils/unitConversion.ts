// Unit conversion utilities

export function metersToFeet(m: number): number {
    return m * 3.28084;
}

export function feetToMeters(ft: number): number {
    return ft / 3.28084;
}

export function msToKnots(ms: number): number {
    return ms * 1.94384;
}

export function knotsToMs(kn: number): number {
    return kn / 1.94384;
}

export function msToKmh(ms: number): number {
    return ms * 3.6;
}

export function msToMph(ms: number): number {
    return ms * 2.23694;
}

export function kmToMiles(km: number): number {
    return km * 0.621371;
}

export function milesToKm(mi: number): number {
    return mi / 0.621371;
}

export function celsiusToFahrenheit(c: number): number {
    return c * 9 / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
    return (f - 32) * 5 / 9;
}

export function formatAltitude(meters: number, imperial: boolean): string {
    if (imperial) {
        return `${Math.round(metersToFeet(meters)).toLocaleString()} ft`;
    }
    return `${Math.round(meters).toLocaleString()} m`;
}

export function formatSpeed(ms: number, imperial: boolean): string {
    if (imperial) {
        return `${Math.round(msToMph(ms))} mph`;
    }
    return `${Math.round(msToKmh(ms))} km/h`;
}

export function formatDistance(meters: number, imperial: boolean): string {
    if (imperial) {
        const miles = kmToMiles(meters / 1000);
        return miles >= 1 ? `${miles.toFixed(1)} mi` : `${Math.round(metersToFeet(meters))} ft`;
    }
    return meters >= 1000
        ? `${(meters / 1000).toFixed(1)} km`
        : `${Math.round(meters)} m`;
}
