// Camera utility functions
export async function flyToCoordinates(viewer: any, lon: number, lat: number, height: number, duration = 2) {
    const Cesium = await import('cesium');
    viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(lon, lat, height), duration });
}
export function getCameraPosition(viewer: any) {
    const Cesium = require('cesium');
    const c = viewer.camera.positionCartographic;
    return { longitude: Cesium.Math.toDegrees(c.longitude), latitude: Cesium.Math.toDegrees(c.latitude), height: c.height };
}
export function getCameraHeading(viewer: any) { const Cesium = require('cesium'); return Cesium.Math.toDegrees(viewer.camera.heading); }
export function getCameraPitch(viewer: any) { const Cesium = require('cesium'); return Cesium.Math.toDegrees(viewer.camera.pitch); }
