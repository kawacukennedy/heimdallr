'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

export default function Compass() {
    const { viewerRef } = useCesiumContext();
    const [heading, setHeading] = useState(0);
    const animFrameRef = useRef<number>();

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        const update = () => {
            if (viewer && !viewer.isDestroyed()) {
                const h = viewer.camera.heading;
                const Cesium = require('cesium');
                setHeading(Cesium.Math.toDegrees(h));
            }
            animFrameRef.current = requestAnimationFrame(update);
        };

        animFrameRef.current = requestAnimationFrame(update);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [viewerRef]);

    const handleResetNorth = async () => {
        const Cesium = await import('cesium');
        const viewer = viewerRef.current;
        if (!viewer) return;

        viewer.camera.flyTo({
            destination: viewer.camera.positionWC,
            orientation: {
                heading: 0,
                pitch: viewer.camera.pitch,
                roll: 0,
            },
            duration: 0.5,
        });
    };

    return (
        <button
            onClick={handleResetNorth}
            className="absolute top-[80px] right-4 z-ui w-10 h-10 rounded-full glass-panel flex items-center justify-center cursor-pointer hover:bg-white/15 transition-colors"
            title="Reset North"
            aria-label="Reset compass to north"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ transform: `rotate(${-heading}deg)`, transition: 'transform 0.1s linear' }}
            >
                <polygon points="12,2 8,14 12,11 16,14" fill="#ff453a" />
                <polygon points="12,22 8,14 12,11 16,14" fill="rgba(255,255,255,0.5)" />
            </svg>
        </button>
    );
}
