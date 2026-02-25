'use client';

import { useUIStore } from '@/store/uiStore';

export function useSettings() {
    const settings = useUIStore((s) => s.settings);
    const updateSettings = useUIStore((s) => s.updateSettings);

    return { settings, updateSettings };
}
