// Shader presets constant
export const SHADER_PRESETS = {
    standard: { label: 'Standard', description: 'Default photorealistic rendering', icon: '☀️', uniforms: {} },
    nightVision: { label: 'Night Vision', description: 'Green phosphor military NVG', icon: '🌙', uniforms: { noiseAmount: 0.1, intensity: 1.2 } },
    thermal: { label: 'Thermal (FLIR)', description: 'Ironbow infrared palette', icon: '🔥', uniforms: {} },
    crt: { label: 'CRT Monitor', description: 'Retro CRT with scan lines', icon: '📺', uniforms: { scanlineIntensity: 0.8, chromaticAberration: 0.002, pixelSize: 1.0 } },
    edgeDetection: { label: 'Edge Detection', description: 'Structural outline overlay', icon: '🔬', uniforms: { edgeColor: [1, 1, 1, 1], threshold: 0.1 } },
} as const;

export type ShaderPresetKey = keyof typeof SHADER_PRESETS;
