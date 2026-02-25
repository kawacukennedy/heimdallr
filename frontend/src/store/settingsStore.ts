import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShaderSettings } from '@/types';

interface SettingsStoreState {
    shaderSettings: ShaderSettings;
    updateShaderSetting: <K extends keyof ShaderSettings>(
        key: K,
        value: ShaderSettings[K]
    ) => void;
    resetShaderSettings: () => void;
}

const defaultShaderSettings: ShaderSettings = {
    bloomIntensity: 1,
    scanlineIntensity: 0.8,
    noiseAmount: 0.1,
    chromaticAberration: 0.002,
    thermalPalette: 'Ironbow',
};

export const useSettingsStore = create<SettingsStoreState>()(
    persist(
        (set) => ({
            shaderSettings: { ...defaultShaderSettings },

            updateShaderSetting: (key, value) =>
                set((state) => ({
                    shaderSettings: { ...state.shaderSettings, [key]: value },
                })),

            resetShaderSettings: () =>
                set({ shaderSettings: { ...defaultShaderSettings } }),
        }),
        {
            name: 'heimdallr-settings',
        }
    )
);
