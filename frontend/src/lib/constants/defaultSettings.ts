import type { AppSettings, ShaderSettings, ShaderPreset } from '@/types';

export const DEFAULT_SETTINGS: AppSettings = {
    units: 'metric',
    updateInterval: 5,
    showFPS: true,
    language: 'en',
};

export const DEFAULT_SHADER_SETTINGS: ShaderSettings = {
    bloomIntensity: 1,
    scanlineIntensity: 0.8,
    noiseAmount: 0.1,
    chromaticAberration: 0.002,
    thermalPalette: 'Ironbow',
};

export const SHADER_PRESETS: Record<
    ShaderPreset,
    { label: string; description: string; icon: string }
> = {
    standard: {
        label: 'Standard',
        description: 'Default photorealistic rendering',
        icon: '☀️',
    },
    nightVision: {
        label: 'Night Vision',
        description: 'Green phosphor military NVG',
        icon: '🌙',
    },
    thermal: {
        label: 'Thermal (FLIR)',
        description: 'Ironbow infrared palette',
        icon: '🔥',
    },
    crt: {
        label: 'CRT Monitor',
        description: 'Retro CRT with scan lines',
        icon: '📺',
    },
    edgeDetection: {
        label: 'Edge Detection',
        description: 'Structural outline overlay',
        icon: '🔬',
    },
};
