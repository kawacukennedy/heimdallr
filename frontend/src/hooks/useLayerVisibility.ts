'use client';

import { useUIStore } from '@/store/uiStore';
import type { LayerKey } from '@/types';

export function useLayerVisibility() {
    const layers = useUIStore((s) => s.layers);
    const toggleLayer = useUIStore((s) => s.toggleLayer);

    const isLayerVisible = (key: LayerKey): boolean => layers[key];

    const setLayerVisible = (key: LayerKey, visible: boolean) => {
        if (layers[key] !== visible) {
            toggleLayer(key);
        }
    };

    const enableAll = () => {
        const keys: LayerKey[] = ['civilian', 'military', 'satellites', 'cctv', 'traffic'];
        keys.forEach((key) => {
            if (!layers[key]) toggleLayer(key);
        });
    };

    const disableAll = () => {
        const keys: LayerKey[] = ['civilian', 'military', 'satellites', 'cctv', 'traffic'];
        keys.forEach((key) => {
            if (layers[key]) toggleLayer(key);
        });
    };

    const getActiveLayerCount = (): number => {
        return Object.values(layers).filter(Boolean).length;
    };

    return {
        layers,
        toggleLayer,
        isLayerVisible,
        setLayerVisible,
        enableAll,
        disableAll,
        getActiveLayerCount,
    };
}
