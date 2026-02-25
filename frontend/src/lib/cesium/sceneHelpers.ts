// Cesium scene initialization helpers

export async function initializeScene(viewer: any) {
    const Cesium = await import('cesium');

    // Global scene settings
    viewer.scene.fog.enabled = true;
    viewer.scene.fog.density = 0.0002;
    viewer.scene.fog.screenSpaceErrorFactor = 2.0;

    // Sun/moon lighting
    viewer.scene.sun = new Cesium.Sun();
    viewer.scene.moon = new Cesium.Moon();
    viewer.scene.skyAtmosphere = new Cesium.SkyAtmosphere();

    // Globe settings
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.showGroundAtmosphere = true;
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;

    // Performance
    viewer.scene.requestRenderMode = true;
    viewer.scene.maximumRenderTimeChange = 0.5;
    viewer.scene.debugShowFramesPerSecond = false;

    // Post-processing
    viewer.scene.postProcessStages.fxaa.enabled = true;

    return viewer;
}

export function destroyScene(viewer: any) {
    if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
    }
}
