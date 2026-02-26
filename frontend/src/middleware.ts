import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self)'
    );
    
    // CSP - allow fonts from Google
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.googleapis.com https://*.openstreetmap.org https://*.supabase.co https://*.cesium.com https://*.virtualearth.net https://*.gstatic.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://opensky-network.org https://adsbexchange.com https://adsb.lol https://*.cesium.com https://nominatim.openstreetmap.org https://tile.googleapis.com https://*.virtualearth.net https://fonts.googleapis.com https://fonts.gstatic.com https://overpass-api.de",
            "worker-src 'self' blob:",
            "frame-src 'none'",
        ].join('; ')
    );

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
};
