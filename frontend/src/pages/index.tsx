import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import TopBar from '@/components/ui/TopBar';
import LeftSidebar from '@/components/ui/LeftSidebar';
import BottomPanel from '@/components/ui/BottomPanel';
import RightPanel from '@/components/ui/RightPanel';
import SearchOverlay from '@/components/ui/SearchOverlay';
import SettingsModal from '@/components/ui/SettingsModal';
import KeyboardShortcutsHelp from '@/components/ui/KeyboardShortcutsHelp';
import MapErrorBoundary from '@/components/map/MapErrorBoundary';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUIStore } from '@/store/uiStore';

// Dynamic imports for heavy components (SSR-disabled)
const CesiumViewer = dynamic(() => import('@/components/map/CesiumViewer'), { ssr: false });
const EntityLayers = dynamic(() => import('@/components/map/EntityLayers'), { ssr: false });
const CustomShaderManager = dynamic(() => import('@/components/map/CustomShaderManager'), { ssr: false });
const LayerManager = dynamic(() => import('@/components/map/LayerManager'), { ssr: false });
const EntityHighlight = dynamic(() => import('@/components/map/EntityHighlight'), { ssr: false });
const EntityLabelRenderer = dynamic(() => import('@/components/map/EntityLabelRenderer'), { ssr: false });
const ParticleSystems = dynamic(() => import('@/components/map/ParticleSystems'), { ssr: false });
const CctvProjectiveTexture = dynamic(() => import('@/components/map/CctvProjectiveTexture'), { ssr: false });
const MapControls = dynamic(() => import('@/components/map/MapControls'), { ssr: false });
const Compass = dynamic(() => import('@/components/map/Compass'), { ssr: false });
const ZoomControls = dynamic(() => import('@/components/map/ZoomControls'), { ssr: false });

// Shader theme classes
const SHADER_THEME_CLASS: Record<string, string> = {
    standard: '',
    nightVision: 'theme-nightvision',
    thermal: 'theme-thermal',
    crt: 'theme-crt',
    edgeDetection: '',
};

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const activeShader = useUIStore((s) => s.activeShader);

    useEffect(() => {
        setMounted(true);
    }, []);

    useKeyboardShortcuts();

    if (!mounted) {
        return <div className="w-screen h-screen bg-black" />; // SSR placeholder
    }

    const themeClass = SHADER_THEME_CLASS[activeShader] || '';

    return (
        <>
            <Head>
                <title>Heimdallr – Geospatial Intelligence Dashboard</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="manifest" href="/manifest.json" />
            </Head>

            <div className={`relative w-full h-full overflow-hidden ${themeClass}`}>
                {/* 3D Map Layer */}
                <MapErrorBoundary>
                    <CesiumViewer>
                        <EntityLayers />
                        <CustomShaderManager />
                        <LayerManager />
                        <EntityHighlight />
                        <EntityLabelRenderer />
                        <ParticleSystems />
                        <CctvProjectiveTexture />
                    </CesiumViewer>
                </MapErrorBoundary>

                {/* Map Controls Overlay */}
                <Compass />
                <ZoomControls />
                <MapControls />

                {/* UI Overlay Layer */}
                <TopBar />
                <LeftSidebar />
                <BottomPanel />
                <RightPanel />

                {/* Modals */}
                <SearchOverlay />
                <SettingsModal />
                <KeyboardShortcutsHelp />
            </div>
        </>
    );
}
