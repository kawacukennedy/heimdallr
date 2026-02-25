// Shader manager — apply/remove post-processing stages
import nightVision from '@/components/shaders/postProcess/nightVision.glsl';
import crt from '@/components/shaders/postProcess/crt.glsl';
import thermal from '@/components/shaders/postProcess/thermal.glsl';
import bloom from '@/components/shaders/postProcess/bloom.glsl';
import edgeDetection from '@/components/shaders/postProcess/edgeDetection.glsl';

const SHADER_SOURCES: Record<string, string> = { nightVision, crt, thermal, bloom, edgeDetection };

export function getShaderSource(name: string): string | null { return SHADER_SOURCES[name] || null; }

export function applyShader(viewer: any, Cesium: any, name: string, uniforms: Record<string, any> = {}) {
    const source = getShaderSource(name);
    if (!source) return null;
    const stage = new Cesium.PostProcessStage({ fragmentShader: source, uniforms });
    viewer.scene.postProcessStages.add(stage);
    return stage;
}

export function removeShader(viewer: any, stage: any) {
    if (stage && viewer) { viewer.scene.postProcessStages.remove(stage); stage.destroy(); }
}

export function removeAllShaders(viewer: any) {
    viewer.scene.postProcessStages.removeAll();
    viewer.scene.postProcessStages.fxaa.enabled = true;
}
