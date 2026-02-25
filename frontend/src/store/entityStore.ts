// Mutable ref-based store for Cesium entities
// This bypasses React render cycle for performance

export interface EntityStoreType {
    civilianFlights: Map<string, any>;
    militaryFlights: Map<string, any>;
    satellites: Map<string, any>;
    cctvMarkers: Map<string, any>;
    roadParticles: Map<string, any>;
}

export function createEntityStore(): EntityStoreType {
    return {
        civilianFlights: new Map(),
        militaryFlights: new Map(),
        satellites: new Map(),
        cctvMarkers: new Map(),
        roadParticles: new Map(),
    };
}

// Entity store helpers
export function addOrUpdateEntity(
    store: Map<string, any>,
    id: string,
    entity: any
): void {
    store.set(id, entity);
}

export function removeEntity(store: Map<string, any>, id: string): boolean {
    return store.delete(id);
}

export function getEntity(store: Map<string, any>, id: string): any | undefined {
    return store.get(id);
}

export function getAllEntities(store: Map<string, any>): any[] {
    return Array.from(store.values());
}

export function clearStore(store: Map<string, any>): void {
    store.clear();
}
