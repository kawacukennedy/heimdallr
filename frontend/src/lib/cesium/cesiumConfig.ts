// Cesium configuration – viewer creation defaults
export const CESIUM_CONFIG = {
    viewerOptions: {
        timeline: false, animation: false, geocoder: false, homeButton: false,
        sceneModePicker: false, baseLayerPicker: false, navigationHelpButton: false,
        fullscreenButton: false, infoBox: false, selectionIndicator: false,
    },
    contextOptions: { webgl: { alpha: true, depth: true, stencil: true, antialias: true, powerPreference: 'high-performance' as const } },
    performance: { targetFrameRate: 60, requestRenderMode: true, maximumRenderTimeChange: 0.5 },
    tileset: { maximumScreenSpaceError: 16, maximumMemoryUsage: 512, cullWithChildrenBounds: true, skipLevelOfDetail: true, baseScreenSpaceError: 1024, skipScreenSpaceErrorFactor: 16, skipLevels: 1, showCreditsOnScreen: true },
};

export function getGoogleTilesUrl(): string {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    return `https://tile.googleapis.com/v1/3dtiles/root.json?key=${key}`;
}
