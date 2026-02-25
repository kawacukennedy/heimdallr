'use client';
import { useCallback, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

export function useParticleSystem() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const systemsRef = useRef<any[]>([]);

    const createParticleSystem = useCallback(async (roadId: string, coordinates: [number, number][]) => {
        const Cesium = await import('cesium');
        const viewer = viewerRef.current;
        if (!viewer || !Cesium || coordinates.length < 2) return;

        const positions = Cesium.Cartesian3.fromDegreesArray(coordinates.flat());
        const entity = viewer.entities.add({
            id: `road-${roadId}`,
            polyline: {
                positions,
                width: 2,
                material: new Cesium.PolylineGlowMaterialProperty({ glowPower: 0.3, color: Cesium.Color.YELLOW.withAlpha(0.4) }),
            },
        });
        entityStoreRef.current.roadParticles.set(roadId, entity);
        systemsRef.current.push(entity);
        return entity;
    }, [viewerRef, entityStoreRef]);

    const clearAll = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        entityStoreRef.current.roadParticles.forEach((entity: any) => viewer.entities.remove(entity));
        entityStoreRef.current.roadParticles.clear();
        systemsRef.current = [];
    }, [viewerRef, entityStoreRef]);

    const setVisible = useCallback((visible: boolean) => {
        entityStoreRef.current.roadParticles.forEach((entity: any) => {
            if (entity.show !== undefined) entity.show = visible;
        });
    }, [entityStoreRef]);

    return { createParticleSystem, clearAll, setVisible };
}
