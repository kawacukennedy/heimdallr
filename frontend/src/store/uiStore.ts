import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LayerKey, ShaderPreset, CameraPosition, Bookmark, AppSettings } from '@/types';

interface UIState {
    // Layer visibility
    layers: Record<LayerKey, boolean>;
    toggleLayer: (layer: LayerKey) => void;

    // Shader
    activeShader: ShaderPreset;
    setShader: (shader: ShaderPreset) => void;

    // Panel visibility
    sidebarOpen: boolean;
    bottomPanelOpen: boolean;
    rightPanelOpen: boolean;
    searchOpen: boolean;
    settingsOpen: boolean;
    helpOpen: boolean;
    toggleSidebar: () => void;
    toggleBottomPanel: () => void;
    toggleRightPanel: () => void;
    setSearchOpen: (open: boolean) => void;
    setSettingsOpen: (open: boolean) => void;
    setHelpOpen: (open: boolean) => void;
    closeAllModals: () => void;

    // Entity selection
    selectedEntityId: string | null;
    selectedEntityType: string | null;
    selectEntity: (id: string | null, type?: string | null) => void;
    clearSelection: () => void;

    // Camera
    cameraPosition: CameraPosition;
    setCameraPosition: (pos: CameraPosition) => void;

    // Bookmarks
    bookmarks: Bookmark[];
    addBookmark: (bookmark: Bookmark) => void;
    removeBookmark: (name: string) => void;

    // Settings
    settings: AppSettings;
    updateSettings: (settings: Partial<AppSettings>) => void;

    // Connection status
    isConnected: boolean;
    wsLatency: number;
    setConnectionStatus: (connected: boolean, latency?: number) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            // Layers
            layers: {
                civilian: true,
                military: true,
                satellites: true,
                cctv: false,
                traffic: true,
            },
            toggleLayer: (layer) =>
                set((state) => ({
                    layers: { ...state.layers, [layer]: !state.layers[layer] },
                })),

            // Shader
            activeShader: 'standard',
            setShader: (shader) => set({ activeShader: shader }),

            // Panels
            sidebarOpen: true,
            bottomPanelOpen: true,
            rightPanelOpen: false,
            searchOpen: false,
            settingsOpen: false,
            helpOpen: false,
            toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
            toggleBottomPanel: () => set((s) => ({ bottomPanelOpen: !s.bottomPanelOpen })),
            toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
            setSearchOpen: (open) => set({ searchOpen: open }),
            setSettingsOpen: (open) => set({ settingsOpen: open }),
            setHelpOpen: (open) => set({ helpOpen: open }),
            closeAllModals: () =>
                set({ searchOpen: false, settingsOpen: false, helpOpen: false }),

            // Selection
            selectedEntityId: null,
            selectedEntityType: null,
            selectEntity: (id, type = null) =>
                set({
                    selectedEntityId: id,
                    selectedEntityType: type,
                    rightPanelOpen: id !== null,
                }),
            clearSelection: () =>
                set({
                    selectedEntityId: null,
                    selectedEntityType: null,
                    rightPanelOpen: false,
                }),

            // Camera
            cameraPosition: { longitude: 0, latitude: 20, height: 20000000 },
            setCameraPosition: (pos) => set({ cameraPosition: pos }),

            // Bookmarks
            bookmarks: [
                { name: 'New York', camera: { longitude: -74.006, latitude: 40.7128, height: 5000 } },
                { name: 'London', camera: { longitude: -0.1276, latitude: 51.5074, height: 5000 } },
                { name: 'Tokyo', camera: { longitude: 139.6917, latitude: 35.6895, height: 5000 } },
            ],
            addBookmark: (bookmark) =>
                set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),
            removeBookmark: (name) =>
                set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.name !== name) })),

            // Settings
            settings: {
                units: 'metric',
                updateInterval: 5,
                showFPS: true,
                language: 'en',
            },
            updateSettings: (newSettings) =>
                set((s) => ({ settings: { ...s.settings, ...newSettings } })),

            // Connection
            isConnected: false,
            wsLatency: 0,
            setConnectionStatus: (connected, latency = 0) =>
                set({ isConnected: connected, wsLatency: latency }),
        }),
        {
            name: 'heimdallr-ui',
            partialize: (state) => ({
                layers: state.layers,
                activeShader: state.activeShader,
                sidebarOpen: state.sidebarOpen,
                bookmarks: state.bookmarks,
                settings: state.settings,
            }),
        }
    )
);
