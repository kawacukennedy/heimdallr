'use client';

import { useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useCesiumContext } from '@/providers/CesiumProvider';

export function useEntitySelection() {
    const selectedEntityId = useUIStore((s) => s.selectedEntityId);
    const selectedEntityType = useUIStore((s) => s.selectedEntityType);
    const selectEntity = useUIStore((s) => s.selectEntity);
    const clearSelection = useUIStore((s) => s.clearSelection);
    const { entityStoreRef, viewerRef } = useCesiumContext();

    const getSelectedEntityData = useCallback(() => {
        if (!selectedEntityId || !selectedEntityType) return null;

        const store = entityStoreRef.current;
        const storeMap: Record<string, Map<string, any>> = {
            flight: store.civilianFlights,
            military: store.militaryFlights,
            satellite: store.satellites,
            cctv: store.cctvMarkers,
        };

        const entityMap = storeMap[selectedEntityType];
        if (!entityMap) return null;

        // Check by raw ID or prefixed ID
        const entity = entityMap.get(selectedEntityId) ||
            entityMap.get(selectedEntityId.replace(/^(civilian-|military-|sat-|cctv-)/, ''));

        return entity?.properties || entity || null;
    }, [selectedEntityId, selectedEntityType, entityStoreRef]);

    const selectAndFlyTo = useCallback(
        async (entityId: string, type: string | null) => {
            selectEntity(entityId, type);
            const viewer = viewerRef.current;
            if (!viewer) return;

            const entity = viewer.entities.getById(entityId);
            if (entity) {
                await viewer.flyTo(entity, { duration: 1.5 });
            }
        },
        [selectEntity, viewerRef]
    );

    return {
        selectedEntityId,
        selectedEntityType,
        selectEntity,
        clearSelection,
        selectAndFlyTo,
        getSelectedEntityData,
    };
}
