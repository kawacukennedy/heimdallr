'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

interface CesiumViewerProps {
    onReady?: (viewer: any) => void;
    children?: React.ReactNode;
}

export default function CesiumViewer({ onReady, children }: CesiumViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { viewerRef } = useCesiumContext();
    const initializedRef = useRef(false);

    const initViewer = useCallback(async () => {
        if (!containerRef.current || initializedRef.current) return;
        initializedRef.current = true;

        // Dynamic import to avoid SSR issues
        const Cesium = await import('cesium');

        // Set the base URL for Cesium assets
        (window as any).CESIUM_BASE_URL = '/assets/cesium';

        const viewer = new Cesium.Viewer(containerRef.current, {
            timeline: false,
            animation: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            infoBox: false,
            selectionIndicator: false,
            creditContainer: document.createElement('div'), // hide credits from main view
            contextOptions: {
                webgl: {
                    alpha: true,
                    depth: true,
                    stencil: true,
                    antialias: true,
                    powerPreference: 'high-performance' as WebGLPowerPreference,
                },
            },
            terrainProvider: await Cesium.createWorldTerrainAsync({
                requestWaterMask: true,
                requestVertexNormals: true
            }),
        });

        // Scene configuration
        viewer.scene.backgroundColor = Cesium.Color.BLACK;
        viewer.scene.globe.enableLighting = true;
        viewer.scene.highDynamicRange = true;
        viewer.scene.postProcessStages.fxaa.enabled = true;

        // Camera & Control Polish for 3D navigation
        viewer.scene.screenSpaceCameraController.enableTilt = true;
        viewer.scene.screenSpaceCameraController.enableZoom = true;
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 10;
        viewer.scene.screenSpaceCameraController.maximumZoomDistance = 50000000;
        // Allows touchpad users to tilt by dragging with two fingers or ctrl+drag
        viewer.scene.screenSpaceCameraController.tiltEventTypes = [
            Cesium.CameraEventType.MIDDLE_DRAG,
            Cesium.CameraEventType.PINCH,
            {
                eventType: Cesium.CameraEventType.LEFT_DRAG,
                modifier: Cesium.KeyboardEventModifier.CTRL
            },
            {
                eventType: Cesium.CameraEventType.RIGHT_DRAG,
                modifier: Cesium.KeyboardEventModifier.CTRL
            }
        ];

        // Performance overrides
        viewer.resolutionScale = 0.8; // Minor downsample for huge performance boost on Retina/4K displays

        // Load Google Photorealistic 3D Tiles (if API key available)
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
            try {
                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`,
                    {
                        showCreditsOnScreen: true,
                        maximumScreenSpaceError: 16,
                        cullWithChildrenBounds: true,
                        skipLevelOfDetail: true,
                        baseScreenSpaceError: 1024,
                        skipScreenSpaceErrorFactor: 16,
                        skipLevels: 1,
                    }
                );
                viewer.scene.primitives.add(tileset);
            } catch (error) {
                console.warn('Failed to load Google 3D Tiles:', error);
            }
        } else {
            // Fallback to open-source OpenStreetMap 3D Buildings if no Google Map Key is provided
            try {
                const osmBuildings = await Cesium.createOsmBuildingsAsync();
                viewer.scene.primitives.add(osmBuildings);
            } catch (error) {
                console.warn('Failed to load OSM 3D Buildings fallback:', error);
            }
        }

        // Set initial camera position (global overview)
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(0, 20, 20000000),
        });

        viewerRef.current = viewer;
        onReady?.(viewer);

        return () => {
            if (!viewer.isDestroyed()) {
                viewer.destroy();
            }
            viewerRef.current = null;
            initializedRef.current = false;
        };
    }, [onReady, viewerRef]);

    useEffect(() => {
        initViewer();
    }, [initViewer]);

    return (
        <div className="absolute inset-0 z-map">
            <div ref={containerRef} className="w-full h-full" />
            {children}
        </div>
    );
}
