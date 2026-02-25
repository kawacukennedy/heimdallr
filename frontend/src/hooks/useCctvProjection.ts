'use client';
import { useCallback, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

export function useCctvProjection() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const activeShaderRef = useRef<any>(null);

    const applyProjection = useCallback(async (cameraId: string) => {
        const Cesium = await import('cesium');
        const viewer = viewerRef.current;
        if (!viewer) return;

        removeProjection();

        const cam = entityStoreRef.current.cctvMarkers.get(cameraId);
        if (!cam) return;

        const position = cam.position?.getValue(Cesium.JulianDate.now());
        if (!position) return;

        const customShader = new Cesium.CustomShader({
            fragmentShaderText: `void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        material.diffuse = mix(material.diffuse, vec3(0.3, 0.6, 1.0), 0.3);
      }`,
        });

        const primitives = viewer.scene.primitives;
        for (let i = 0; i < primitives.length; i++) {
            const prim = primitives.get(i);
            if (prim instanceof Cesium.Cesium3DTileset) {
                prim.customShader = customShader;
                activeShaderRef.current = { tileset: prim, shader: customShader };
                break;
            }
        }
        viewer.scene.requestRender();
    }, [viewerRef, entityStoreRef]);

    const removeProjection = useCallback(() => {
        if (activeShaderRef.current) {
            activeShaderRef.current.tileset.customShader = undefined;
            activeShaderRef.current = null;
            viewerRef.current?.scene.requestRender();
        }
    }, [viewerRef]);

    return { applyProjection, removeProjection };
}
