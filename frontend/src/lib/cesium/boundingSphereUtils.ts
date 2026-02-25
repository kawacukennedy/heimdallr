// Bounding sphere utilities
export async function computeBoundingSphere(positions: any[]) {
    const Cesium = await import('cesium');
    return Cesium.BoundingSphere.fromPoints(positions);
}
export async function flyToBoundingSphere(viewer: any, center: { lon: number; lat: number; alt: number }, radius: number, duration = 2) {
    const Cesium = await import('cesium');
    const sphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(center.lon, center.lat, center.alt), radius);
    viewer.camera.flyToBoundingSphere(sphere, { duration });
}
