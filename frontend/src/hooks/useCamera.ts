'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';
import type { CameraPosition, Bookmark } from '@/types';

export function useCamera() {
    const { viewerRef } = useCesiumContext();
    const setCameraPosition = useUIStore((s) => s.setCameraPosition);
    const cesiumRef = useRef<typeof import('cesium') | null>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    const flyTo = useCallback(
        async (position: CameraPosition, duration = 2.0) => {
            const Cesium = cesiumRef.current;
            const viewer = viewerRef.current;
            if (!Cesium || !viewer) return;

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    position.longitude,
                    position.latitude,
                    position.height
                ),
                orientation: {
                    heading: Cesium.Math.toRadians(position.heading || 0),
                    pitch: Cesium.Math.toRadians(position.pitch || -45),
                    roll: Cesium.Math.toRadians(position.roll || 0),
                },
                duration,
                easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
            });
        },
        [viewerRef]
    );

    const flyToBookmark = useCallback(
        (bookmark: Bookmark) => flyTo(bookmark.camera),
        [flyTo]
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

    const getCameraPosition = useCallback((): CameraPosition | null => {
        const viewer = viewerRef.current;
        const Cesium = cesiumRef.current;
        if (!viewer || !Cesium) return null;

        const carto = viewer.camera.positionCartographic;
        return {
            longitude: Cesium.Math.toDegrees(carto.longitude),
            latitude: Cesium.Math.toDegrees(carto.latitude),
            height: carto.height,
            heading: Cesium.Math.toDegrees(viewer.camera.heading),
            pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
            roll: Cesium.Math.toDegrees(viewer.camera.roll),
        };
    }, [viewerRef]);

    const zoomIn = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        viewer.camera.zoomIn(viewer.camera.positionCartographic.height * 0.3);
    }, [viewerRef]);

    const zoomOut = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        viewer.camera.zoomOut(viewer.camera.positionCartographic.height * 0.3);
    }, [viewerRef]);

    const resetView = useCallback(async () => {
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        if (!Cesium || !viewer) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
            duration: 2.0,
        });
    }, [viewerRef]);

    return {
        flyTo,
        flyToBookmark,
        flyToEntity,
        getCameraPosition,
        zoomIn,
        zoomOut,
        resetView,
    };
}
