'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { EntityStoreType, createEntityStore } from '@/store/entityStore';

interface CesiumContextType {
    viewerRef: React.MutableRefObject<any | null>;
    entityStoreRef: React.MutableRefObject<EntityStoreType>;
}

const CesiumContext = createContext<CesiumContextType | null>(null);

export function CesiumProvider({ children }: { children: ReactNode }) {
    const viewerRef = useRef<any | null>(null);
    const entityStoreRef = useRef<EntityStoreType>(createEntityStore());

    return (
        <CesiumContext.Provider value={{ viewerRef, entityStoreRef }}>
            {children}
        </CesiumContext.Provider>
    );
}

export function useCesiumContext(): CesiumContextType {
    const ctx = useContext(CesiumContext);
    if (!ctx) {
        throw new Error('useCesiumContext must be used within a CesiumProvider');
    }
    return ctx;
}
