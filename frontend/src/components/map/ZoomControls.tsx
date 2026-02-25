'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCesiumContext } from '@/providers/CesiumProvider';

export default function ZoomControls() {
    const { viewerRef } = useCesiumContext();

    const handleZoomIn = () => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        const height = viewer.camera.positionCartographic.height;
        viewer.camera.zoomIn(height * 0.3);
    };

    const handleZoomOut = () => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        const height = viewer.camera.positionCartographic.height;
        viewer.camera.zoomOut(height * 0.3);
    };

    return (
        <div className="absolute bottom-[300px] right-4 z-ui flex flex-col glass-panel overflow-hidden">
            <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-white/10 transition-colors border-b border-white/10"
                aria-label="Zoom in"
                title="Zoom in"
            >
                <Plus size={16} className="text-white/70" />
            </button>
            <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-white/10 transition-colors"
                aria-label="Zoom out"
                title="Zoom out"
            >
                <Minus size={16} className="text-white/70" />
            </button>
        </div>
    );
}
