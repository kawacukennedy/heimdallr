import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://heimdallr-backend.onrender.com';
        
        const res = await fetch(`${backendUrl}/api/cctv/live`, {
            next: { revalidate: 30 } // Cache for 30 seconds
        });
        
        if (!res.ok) {
            console.error('CCTV live API error:', res.status);
            return NextResponse.json([], { status: res.status });
        }
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('CCTV live API route error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
