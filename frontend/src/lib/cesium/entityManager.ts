// Entity manager — bulk CRUD ops on Cesium entities
export function addEntity(viewer: any, entityDef: any) { return viewer.entities.add(entityDef); }
export function removeEntity(viewer: any, id: string) { const e = viewer.entities.getById(id); if (e) viewer.entities.remove(e); }
export function removeAllByPrefix(viewer: any, prefix: string) { const toRemove = viewer.entities.values.filter((e: any) => e.id?.startsWith(prefix)); toRemove.forEach((e: any) => viewer.entities.remove(e)); }
export function setShowByPrefix(viewer: any, prefix: string, show: boolean) { viewer.entities.values.forEach((e: any) => { if (e.id?.startsWith(prefix)) e.show = show; }); }
export function getEntityById(viewer: any, id: string) { return viewer.entities.getById(id); }
export function getEntitiesCount(viewer: any) { return viewer.entities.values.length; }
