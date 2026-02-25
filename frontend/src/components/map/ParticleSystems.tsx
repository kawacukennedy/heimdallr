'use client';

import { useEffect, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';

export default function ParticleSystems() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const layers = useUIStore((s) => s.layers);
    const particleSystemsRef = useRef<any[]>([]);
    const cesiumRef = useRef<typeof import('cesium') | null>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    useEffect(() => {
        const viewer = viewerRef.current;
        const Cesium = cesiumRef.current;
        if (!viewer || !Cesium || !layers.traffic) return;

        // Create road particle systems from stored road data
        const store = entityStoreRef.current.roadParticles;
        store.forEach((ps: any) => {
            if (ps && ps.show !== undefined) {
                ps.show = layers.traffic;
            }
        });

        viewer.scene.requestRender();
    }, [layers.traffic, viewerRef, entityStoreRef]);

    const createRoadParticleSystem = async (
        coordinates: [number, number][],
        roadId: string
    ) => {
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        if (!Cesium || !viewer || coordinates.length < 2) return;

        const flatCoords = coordinates.flat();
        const positions = Cesium.Cartesian3.fromDegreesArray(flatCoords);

        // Create a polyline for the road
        const roadEntity = viewer.entities.add({
            id: `road-${roadId}`,
            polyline: {
                positions,
                width: 2,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.3,
                    color: Cesium.Color.YELLOW.withAlpha(0.4),
                }),
                show: layers.traffic,
            },
        });

        entityStoreRef.current.roadParticles.set(roadId, roadEntity);
        return roadEntity;
    };

    const clearAllParticleSystems = () => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        entityStoreRef.current.roadParticles.forEach((entity: any, id: string) => {
            viewer.entities.remove(entity);
        });
        entityStoreRef.current.roadParticles.clear();
        particleSystemsRef.current = [];
    };

    return null;
}
