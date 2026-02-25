'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';

// Import shaders as raw strings
import nightVisionShader from '@/components/shaders/postProcess/nightVision.glsl';
import crtShader from '@/components/shaders/postProcess/crt.glsl';
import thermalShader from '@/components/shaders/postProcess/thermal.glsl';
import edgeDetectionShader from '@/components/shaders/postProcess/edgeDetection.glsl';

export default function CustomShaderManager() {
    const { viewerRef } = useCesiumContext();
    const activeShader = useUIStore((s) => s.activeShader);
    const shaderSettings = useSettingsStore((s) => s.shaderSettings);
    const activeStagesRef = useRef<any[]>([]);
    const cesiumRef = useRef<typeof import('cesium') | null>(null);

    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    const clearActiveStages = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        activeStagesRef.current.forEach((stage) => {
            try {
                viewer.scene.postProcessStages.remove(stage);
            } catch (e) {
                // Stage may already be removed
            }
        });
        activeStagesRef.current = [];
    }, [viewerRef]);

    useEffect(() => {
        const viewer = viewerRef.current;
        const Cesium = cesiumRef.current;
        if (!viewer || !Cesium) return;

        clearActiveStages();

        if (activeShader === 'standard') {
            // No post-process effects
            viewer.scene.requestRender();
            return;
        }

        try {
            let stage: any;

            switch (activeShader) {
                case 'nightVision':
                    stage = new Cesium.PostProcessStage({
                        fragmentShader: nightVisionShader,
                        uniforms: {
                            noiseAmount: shaderSettings.noiseAmount,
                            intensity: 1.2,
                        },
                    });
                    break;

                case 'crt':
                    stage = new Cesium.PostProcessStage({
                        fragmentShader: crtShader,
                        uniforms: {
                            scanlineIntensity: shaderSettings.scanlineIntensity,
                            chromaticAberration: shaderSettings.chromaticAberration,
                            pixelSize: 1.0,
                        },
                    });
                    break;

                case 'thermal':
                    stage = new Cesium.PostProcessStage({
                        fragmentShader: thermalShader,
                        uniforms: {},
                    });
                    break;

                case 'edgeDetection':
                    stage = new Cesium.PostProcessStage({
                        fragmentShader: edgeDetectionShader,
                        uniforms: {
                            edgeColor: new Cesium.Color(1, 1, 1, 1),
                            threshold: 0.1,
                        },
                    });
                    break;
            }

            if (stage) {
                viewer.scene.postProcessStages.add(stage);
                activeStagesRef.current.push(stage);
            }
        } catch (error) {
            console.error('Failed to apply shader:', error);
        }

        viewer.scene.requestRender();
    }, [activeShader, shaderSettings, viewerRef, clearActiveStages]);

    return null;
}
