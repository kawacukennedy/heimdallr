'use client';

import { useEffect, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';

export default function CctvProjectiveTexture() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const cesiumRef = useRef<typeof import('cesium') | null>(null);
    const activeShaderRef = useRef<any>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    const applyProjectiveTexture = async (
        cameraId: string,
        imageUrl: string
    ) => {
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        if (!Cesium || !viewer) return;

        const camEntity = entityStoreRef.current.cctvMarkers.get(cameraId);
        if (!camEntity) return;

        // Remove existing shader
        removeProjectiveTexture();

        try {
            // Create texture from CCTV image
            const resource = new Cesium.Resource({ url: imageUrl });

            // Compute the projection matrix from camera properties
            const camPosition = camEntity.position?.getValue(Cesium.JulianDate.now());
            if (!camPosition) return;

            const heading = camEntity.properties?.heading?.getValue() || 0;
            const pitch = camEntity.properties?.pitch?.getValue() || -15;

            // Create a custom shader for projective texturing
            const customShader = new Cesium.CustomShader({
                fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
            material.diffuse = mix(material.diffuse, vec3(0.3, 0.6, 1.0), 0.3);
          }
        `,
            });

            // Apply to the scene's 3D tileset if available
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
        } catch (error) {
            console.error('Failed to apply projective texture:', error);
        }
    };

    const removeProjectiveTexture = () => {
        if (activeShaderRef.current) {
            activeShaderRef.current.tileset.customShader = undefined;
            activeShaderRef.current = null;
            viewerRef.current?.scene.requestRender();
        }
    };

    return null;
}

export { CctvProjectiveTexture };
