export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://heimdallr-backend.onrender.com';
        const res = await fetch(`${backendUrl}/api/satellites/tle`);

        if (!res.ok) throw new Error('Failed to fetch TLE from backend');

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Satellites TLE API route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
