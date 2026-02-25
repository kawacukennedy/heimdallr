'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import type { LayerKey, ShaderPreset } from '@/types';

export function useKeyboardShortcuts() {
    const toggleLayer = useUIStore((s) => s.toggleLayer);
    const setShader = useUIStore((s) => s.setShader);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);
    const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel);
    const toggleRightPanel = useUIStore((s) => s.toggleRightPanel);
    const setSearchOpen = useUIStore((s) => s.setSearchOpen);
    const setHelpOpen = useUIStore((s) => s.setHelpOpen);
    const clearSelection = useUIStore((s) => s.clearSelection);
    const closeAllModals = useUIStore((s) => s.closeAllModals);
    const selectedEntityId = useUIStore((s) => s.selectedEntityId);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            switch (e.key) {
                // Layers
                case '1': toggleLayer('civilian'); break;
                case '2': toggleLayer('military'); break;
                case '3': toggleLayer('satellites'); break;
                case '4': toggleLayer('cctv'); break;
                case '5': toggleLayer('traffic'); break;

                // Shaders
                case 'n': setShader('nightVision'); break;
                case 't': setShader('thermal'); break;
                case 'c': setShader('crt'); break;
                case 's': setShader('standard'); break;

                // Panels
                case 'b': toggleSidebar(); break;
                case 'p': toggleBottomPanel(); break;
                case 'r': toggleRightPanel(); break;

                // Search
                case '/':
                    e.preventDefault();
                    setSearchOpen(true);
                    break;

                // Help
                case '?': setHelpOpen(true); break;

                // Escape
                case 'Escape':
                    clearSelection();
                    closeAllModals();
                    break;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [
        toggleLayer, setShader, toggleSidebar, toggleBottomPanel,
        toggleRightPanel, setSearchOpen, setHelpOpen, clearSelection,
        closeAllModals, selectedEntityId,
    ]);
}
