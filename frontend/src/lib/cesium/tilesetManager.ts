// Tileset manager — load/unload 3D tilesets
export async function loadGoogleTileset(viewer: any, apiKey: string) {
    const Cesium = await import('cesium');
    const url = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`;
    const tileset = await Cesium.Cesium3DTileset.fromUrl(url, { showCreditsOnScreen: true, maximumScreenSpaceError: 16 } as any);
    viewer.scene.primitives.add(tileset);
    return tileset;
}

export function removeTileset(viewer: any, tileset: any) {
    if (viewer && tileset) viewer.scene.primitives.remove(tileset);
}
