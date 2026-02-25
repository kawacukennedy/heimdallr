// Coordinate conversion utilities (Cesium-specific)
export async function degreesToCartesian(lon: number, lat: number, height = 0) {
    const Cesium = await import('cesium');
    return Cesium.Cartesian3.fromDegrees(lon, lat, height);
}
export async function cartesianToDegrees(cartesian: any) {
    const Cesium = await import('cesium');
    const carto = Cesium.Cartographic.fromCartesian(cartesian);
    return { lon: Cesium.Math.toDegrees(carto.longitude), lat: Cesium.Math.toDegrees(carto.latitude), height: carto.height };
}
export async function degreesArrayToCartesian(coords: [number, number][]) {
    const Cesium = await import('cesium');
    return Cesium.Cartesian3.fromDegreesArray(coords.flat());
}
