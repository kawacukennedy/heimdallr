// Cesium entity factory helpers

export async function createFlightEntity(
    viewer: any,
    flight: { icao24: string; callsign: string; lat: number; lon: number; alt: number; heading: number },
    isMilitary = false
) {
    const Cesium = await import('cesium');

    return viewer.entities.add({
        id: `${isMilitary ? 'military' : 'civilian'}-${flight.icao24}`,
        position: Cesium.Cartesian3.fromDegrees(flight.lon, flight.lat, flight.alt),
        point: {
            pixelSize: isMilitary ? 8 : 6,
            color: isMilitary ? Cesium.Color.ORANGE : Cesium.Color.WHITE,
            outlineColor: isMilitary ? Cesium.Color.RED : Cesium.Color.BLACK,
            outlineWidth: 1,
        },
        label: {
            text: flight.callsign || flight.icao24,
            show: false,
            font: '12px Inter, sans-serif',
            fillColor: isMilitary ? Cesium.Color.ORANGE : Cesium.Color.WHITE,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -12),
            scale: 0.8,
        },
    });
}

export async function createSatelliteEntity(
    viewer: any,
    satellite: { id: string; name: string; lon: number; lat: number; height: number; orbitType?: string }
) {
    const Cesium = await import('cesium');

    const color = satellite.orbitType === 'GEO'
        ? Cesium.Color.YELLOW
        : satellite.orbitType === 'MEO'
            ? Cesium.Color.CYAN
            : Cesium.Color.LIME;

    return viewer.entities.add({
        id: satellite.id,
        position: Cesium.Cartesian3.fromDegrees(
            satellite.lon,
            satellite.lat,
            satellite.height * 1000 // km → m
        ),
        point: {
            pixelSize: 4,
            color,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 0.5,
        },
        label: {
            text: satellite.name,
            show: false,
            font: '10px JetBrains Mono, monospace',
            fillColor: color,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 1,
            outlineColor: Cesium.Color.BLACK,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -8),
            scale: 0.7,
        },
    });
}

export async function createCctvEntity(
    viewer: any,
    camera: { id: string; lat: number; lon: number; label?: string; heading: number }
) {
    const Cesium = await import('cesium');

    return viewer.entities.add({
        id: `cctv-${camera.id}`,
        position: Cesium.Cartesian3.fromDegrees(camera.lon, camera.lat, 10),
        billboard: {
            image: '/assets/icons/cctv-marker.png',
            width: 24,
            height: 24,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
        label: {
            text: camera.label || camera.id,
            show: false,
            font: '11px Inter, sans-serif',
            fillColor: Cesium.Color.fromCssColorString('#0a84ff'),
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 1,
            outlineColor: Cesium.Color.BLACK,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -28),
            scale: 0.8,
        },
    });
}
