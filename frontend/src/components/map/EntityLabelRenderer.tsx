'use client';

import { useEffect, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

export default function EntityLabelRenderer() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const cesiumRef = useRef<typeof import('cesium') | null>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    useEffect(() => {
        const viewer = viewerRef.current;
        const Cesium = cesiumRef.current;
        if (!viewer || !Cesium) return;

        const updateLabels = () => {
            const cameraHeight = viewer.camera.positionCartographic.height;
            const showLabels = cameraHeight < 500000; // Show labels below 500km

            const allStores = [
                entityStoreRef.current.civilianFlights,
                entityStoreRef.current.militaryFlights,
                entityStoreRef.current.satellites,
                entityStoreRef.current.cctvMarkers,
            ];

            allStores.forEach((store) => {
                store.forEach((entity: any) => {
                    if (entity.label) {
                        entity.label.show = showLabels;
                        // Scale labels based on distance
                        if (showLabels) {
                            const scale = Math.max(0.5, Math.min(1.0, 100000 / cameraHeight));
                            entity.label.scale = scale;
                        }
                    }
                });
            });
        };

        viewer.camera.changed.addEventListener(updateLabels);
        return () => {
            viewer.camera.changed.removeEventListener(updateLabels);
        };
    }, [viewerRef, entityStoreRef]);

    return null;
}
