'use client';

import React from 'react';
import { LocateFixed, Home } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { useCesiumContext } from '@/providers/CesiumProvider';

export default function MapControls() {
    const { viewerRef } = useCesiumContext();

    const handleResetView = async () => {
        const Cesium = await import('cesium');
        const viewer = viewerRef.current;
        if (!viewer) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
            duration: 2.0,
            easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
        });
    };

    const handleLocateMe = async () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const Cesium = await import('cesium');
                const viewer = viewerRef.current;
                if (!viewer) return;

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        position.coords.longitude,
                        position.coords.latitude,
                        5000
                    ),
                    duration: 2.0,
                });
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
            }
        );
    };

    return (
        <div className="absolute bottom-[220px] right-4 z-ui flex flex-col gap-2">
            <IconButton
                icon={Home}
                onClick={handleResetView}
                variant="outline"
                tooltip="Reset view (global)"
                aria-label="Reset view"
            />
            <IconButton
                icon={LocateFixed}
                onClick={handleLocateMe}
                variant="outline"
                tooltip="My location"
                aria-label="My location"
            />
        </div>
    );
}
