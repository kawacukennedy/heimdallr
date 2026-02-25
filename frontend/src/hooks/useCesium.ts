'use client';

import { useCesiumContext } from '@/providers/CesiumProvider';

export function useCesium() {
    const { viewerRef, entityStoreRef } = useCesiumContext();

    return {
        viewer: viewerRef.current,
        viewerRef,
        entityStore: entityStoreRef.current,
        entityStoreRef,
        isReady: viewerRef.current !== null,
    };
}
