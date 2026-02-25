'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';

export default function EntityHighlight() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const selectedEntityId = useUIStore((s) => s.selectedEntityId);
    const previousIdRef = useRef<string | null>(null);
    const cesiumRef = useRef<typeof import('cesium') | null>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    const removeHighlight = useCallback(
        (entityId: string) => {
            const Cesium = cesiumRef.current;
            const viewer = viewerRef.current;
            if (!Cesium || !viewer) return;

            const entity = viewer.entities.getById(entityId);
            if (entity && entity.point) {
                // Restore original point size
                entity.point.pixelSize = (entity as any)._originalPixelSize || 6;
                entity.point.outlineWidth = 1;
            }
            if (entity && entity.label) {
                entity.label.show = false;
            }
        },
        [viewerRef]
    );

    const addHighlight = useCallback(
        (entityId: string) => {
            const Cesium = cesiumRef.current;
            const viewer = viewerRef.current;
            if (!Cesium || !viewer) return;

            const entity = viewer.entities.getById(entityId);
            if (entity && entity.point) {
                // Save original and enlarge
                (entity as any)._originalPixelSize = entity.point.pixelSize?.getValue(Cesium.JulianDate.now()) || 6;
                entity.point.pixelSize = 14 as any;
                entity.point.outlineWidth = 3 as any;
                entity.point.outlineColor = Cesium.Color.CYAN as any;
            }
            if (entity && entity.label) {
                entity.label.show = true as any;
            }
        },
        [viewerRef]
    );

    useEffect(() => {
        // Remove previous highlight
        if (previousIdRef.current && previousIdRef.current !== selectedEntityId) {
            removeHighlight(previousIdRef.current);
        }

        // Add new highlight
        if (selectedEntityId) {
            addHighlight(selectedEntityId);
        }

        previousIdRef.current = selectedEntityId;
    }, [selectedEntityId, addHighlight, removeHighlight]);

    return null;
}
