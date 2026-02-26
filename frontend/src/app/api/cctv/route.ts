import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://heimdallr-backend.onrender.com';
        
        // Try to fetch from live endpoint first
        const liveRes = await fetch(`${backendUrl}/api/cctv/live`, {
            next: { revalidate: 60 } // Cache for 60 seconds
        });
        
        if (liveRes.ok) {
            const liveData = await liveRes.json();
            if (liveData && liveData.length > 0) {
                return NextResponse.json(liveData);
            }
        }
        
        // Fallback to database cameras
        const res = await fetch(`${backendUrl}/api/cctv`);
        if (!res.ok) throw new Error('Failed to fetch from backend');
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('CCTV API route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
