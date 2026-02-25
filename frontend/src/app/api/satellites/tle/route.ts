export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://heimdallr-backend.onrender.com';
        const res = await fetch(`${backendUrl}/api/roads/default`);

        if (!res.ok) throw new Error('Failed to fetch from backend');

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Roads API route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
