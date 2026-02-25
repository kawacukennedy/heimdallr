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
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.googleapis.com https://*.openstreetmap.org https://*.supabase.co",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://opensky-network.org https://adsbexchange.com https://celestrak.com https://nominatim.openstreetmap.org https://tile.googleapis.com",
            "worker-src 'self' blob:",
            "frame-src 'none'",
        ].join('; ')
    );

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
};
