// Cesium type augmentations
declare module 'cesium' {
    interface Viewer {
        _cesiumWidget: any;
        scene: Scene;
        camera: Camera;
        entities: EntityCollection;
        destroy(): void;
        isDestroyed(): boolean;
        flyTo(target: Entity | Entity[] | EntityCollection | DataSource, options?: { duration?: number; maximumHeight?: number; offset?: HeadingPitchRange }): Promise<boolean>;
    }

    interface Scene {
        globe: Globe;
        camera: Camera;
        primitives: PrimitiveCollection;
        postProcessStages: PostProcessStageCollection;
        requestRender(): void;
        fog: { enabled: boolean; density: number; screenSpaceErrorFactor: number };
        highDynamicRange: boolean;
        backgroundColor: Color;
        sun: any;
        moon: any;
        skyAtmosphere: any;
        requestRenderMode: boolean;
        maximumRenderTimeChange: number;
        debugShowFramesPerSecond: boolean;
    }

    interface Globe {
        enableLighting: boolean;
        depthTestAgainstTerrain: boolean;
        showGroundAtmosphere: boolean;
        baseColor: Color;
    }
}

export { };
