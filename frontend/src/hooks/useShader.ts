'use client';

import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { ShaderPreset, ShaderSettings } from '@/types';

export function useShader() {
    const activeShader = useUIStore((s) => s.activeShader);
    const setShader = useUIStore((s) => s.setShader);
    const shaderSettings = useSettingsStore((s) => s.shaderSettings);
    const updateShaderSetting = useSettingsStore((s) => s.updateShaderSetting);
    const resetShaderSettings = useSettingsStore((s) => s.resetShaderSettings);

    const cycleShader = () => {
        const presets: ShaderPreset[] = ['standard', 'nightVision', 'thermal', 'crt', 'edgeDetection'];
        const idx = presets.indexOf(activeShader);
        const next = presets[(idx + 1) % presets.length];
        setShader(next);
    };

    return {
        activeShader,
        setShader,
        cycleShader,
        shaderSettings,
        updateShaderSetting,
        resetShaderSettings,
    };
}
