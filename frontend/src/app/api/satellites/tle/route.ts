import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
        const res = await fetch(`${backendUrl}/satellites/tle`);

        if (!res.ok) throw new Error('Failed to fetch from backend');

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('TLE API route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
