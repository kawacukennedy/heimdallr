import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://heimdallr-backend.onrender.com';
        // Default to major cities for demo
        const cities = ['Austin', 'New York', 'London', 'Tokyo'];
        const results = [];
        
        for (const city of cities) {
            try {
                const res = await fetch(`${backendUrl}/api/roads/${encodeURIComponent(city)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.features) {
                        results.push(...data.features);
                    }
                }
            } catch (e) {
                // Continue with other cities
            }
        }
        
        return NextResponse.json({
            type: 'FeatureCollection',
            features: results.slice(0, 500), // Limit to 500 features
        });
    } catch (error) {
        console.error('Roads API route error:', error);
        return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 500 });
    }
}
