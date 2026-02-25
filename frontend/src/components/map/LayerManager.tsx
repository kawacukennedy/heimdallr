'use client';

import { useEffect, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';

export default function LayerManager() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const layers = useUIStore((s) => s.layers);
    const cesiumRef = useRef<typeof import('cesium') | null>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    // Sync layer visibility with Cesium entities
    useEffect(() => {
        const store = entityStoreRef.current;
        const viewer = viewerRef.current;
        if (!viewer) return;

        // Civilian flights
        store.civilianFlights.forEach((entity: any) => {
            if (entity.show !== undefined) entity.show = layers.civilian;
            if (entity.point) entity.point.show = layers.civilian;
            if (entity.label && !layers.civilian) entity.label.show = false;
        });

        // Military flights
        store.militaryFlights.forEach((entity: any) => {
            if (entity.show !== undefined) entity.show = layers.military;
            if (entity.point) entity.point.show = layers.military;
            if (entity.label && !layers.military) entity.label.show = false;
        });

        // Satellites
        store.satellites.forEach((entity: any) => {
            if (entity.show !== undefined) entity.show = layers.satellites;
            if (entity.point) entity.point.show = layers.satellites;
            if (entity.path) entity.path.show = layers.satellites;
        });

        // CCTV
        store.cctvMarkers.forEach((entity: any) => {
            if (entity.show !== undefined) entity.show = layers.cctv;
            if (entity.model) entity.model.show = layers.cctv;
        });

        // Road traffic
        store.roadParticles.forEach((entity: any) => {
            if (entity.show !== undefined) entity.show = layers.traffic;
            if (entity.polyline) entity.polyline.show = layers.traffic;
        });

        viewer.scene.requestRender();
    }, [layers, entityStoreRef, viewerRef]);

    // Clustering for dense layers
    useEffect(() => {
        const viewer = viewerRef.current;
        const Cesium = cesiumRef.current;
        if (!viewer || !Cesium) return;

        // Set clustering for the default entity collection
        if (viewer.entities) {
            const entityCluster = viewer.entities as any;
            if (entityCluster.clusterBillboards !== undefined) {
                entityCluster.clusterBillboards = true;
                entityCluster.clusterLabels = true;
                entityCluster.clusterPoints = true;
                entityCluster.minimumClusterSize = 10;
                entityCluster.pixelRange = 25;
            }
        }
    }, [viewerRef]);

    return null;
}
