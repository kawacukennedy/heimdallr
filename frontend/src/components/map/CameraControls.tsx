'use client';

import { useCallback } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

interface CameraControlsProps {
    onCameraMove?: (position: { longitude: number; latitude: number; height: number }) => void;
}

export default function CameraControls({ onCameraMove }: CameraControlsProps) {
    const { viewerRef } = useCesiumContext();

    const flyToLocation = useCallback(
        async (lon: number, lat: number, height: number, duration = 2.0) => {
            const Cesium = await import('cesium');
            const viewer = viewerRef.current;
            if (!viewer) return;

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
                duration,
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
            });
        },
        [viewerRef]
    );

    const flyToEntity = useCallback(
        async (entityId: string) => {
            const viewer = viewerRef.current;
            if (!viewer) return;
            const entity = viewer.entities.getById(entityId);
            if (entity) {
                await viewer.flyTo(entity, { duration: 1.5 });
            }
        },
        [viewerRef]
    );

    const flyToBoundingSphere = useCallback(
        async (center: { lon: number; lat: number; alt: number }, radius: number) => {
            const Cesium = await import('cesium');
            const viewer = viewerRef.current;
            if (!viewer) return;

            const sphere = new Cesium.BoundingSphere(
                Cesium.Cartesian3.fromDegrees(center.lon, center.lat, center.alt),
                radius
            );
            viewer.camera.flyToBoundingSphere(sphere, { duration: 2.0 });
        },
        [viewerRef]
    );

    const resetView = useCallback(async () => {
        const Cesium = await import('cesium');
        const viewer = viewerRef.current;
        if (!viewer) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
            duration: 2.0,
        });
    }, [viewerRef]);

    const zoomIn = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        const currentHeight = viewer.camera.positionCartographic.height;
        viewer.camera.zoomIn(currentHeight * 0.3);
    }, [viewerRef]);

    const zoomOut = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        const currentHeight = viewer.camera.positionCartographic.height;
        viewer.camera.zoomOut(currentHeight * 0.3);
    }, [viewerRef]);

    const getCurrentPosition = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return null;
        const carto = viewer.camera.positionCartographic;
        const Cesium = require('cesium');
        return {
            longitude: Cesium.Math.toDegrees(carto.longitude),
            latitude: Cesium.Math.toDegrees(carto.latitude),
            height: carto.height,
            heading: Cesium.Math.toDegrees(viewer.camera.heading),
            pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
            roll: Cesium.Math.toDegrees(viewer.camera.roll),
        };
    }, [viewerRef]);

    return null; // Imperative component, API exposed via hooks
}

export { CameraControls };
