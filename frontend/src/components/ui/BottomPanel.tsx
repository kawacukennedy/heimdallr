'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Satellite, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import GlassPanel from './GlassPanel';
import CctvThumbnailGrid from './CctvThumbnailGrid';
import { useUIStore } from '@/store/uiStore';
import { useCesiumContext } from '@/providers/CesiumProvider';
import type { CCTVCamera } from '@/types';

const TABS = ['Flights', 'Satellites', 'CCTV'] as const;
type TabName = (typeof TABS)[number];

const TAB_ICONS: Record<TabName, React.ElementType> = {
    Flights: Plane,
    Satellites: Satellite,
    CCTV: Camera,
};

interface EntityEntry {
    id: string;
    label: string;
    detail: string;
    type: string;
}

export default function BottomPanel() {
    const bottomPanelOpen = useUIStore((s) => s.bottomPanelOpen);
    const toggleBottomPanel = useUIStore((s) => s.toggleBottomPanel);
    const selectEntity = useUIStore((s) => s.selectEntity);
    const { entityStoreRef } = useCesiumContext();
    const [activeTab, setActiveTab] = useState<TabName>('Flights');
    const [flights, setFlights] = useState<EntityEntry[]>([]);
    const [sats, setSats] = useState<EntityEntry[]>([]);
    const [cctvCameras, setCctvCameras] = useState<CCTVCamera[]>([]);

    // Refresh entity data every 2 seconds
    const refreshData = useCallback(() => {
        const store = entityStoreRef.current;

        // Flights
        const flightEntries: EntityEntry[] = [];
        store.civilianFlights.forEach((entity, id) => {
            const props = entity.properties;
            const callsign = props?.callsign ?? props?._callsign ?? id;
            const alt = props?.alt ?? props?._alt ?? '—';
            const velocity = props?.velocity ?? props?._velocity ?? '—';
            const heading = props?.heading ?? props?._heading ?? '—';
            flightEntries.push({
                id: entity.id || `civilian-${id}`,
                label: String(callsign),
                detail: `${alt} m · ${velocity} m/s · ${heading}°`,
                type: 'flight',
            });
        });
        store.militaryFlights.forEach((entity, id) => {
            const props = entity.properties;
            const callsign = props?.callsign ?? props?._callsign ?? id;
            const alt = props?.alt ?? props?._alt ?? '—';
            flightEntries.push({
                id: entity.id || `military-${id}`,
                label: `⚔ ${callsign}`,
                detail: `${alt} m · MILITARY`,
                type: 'military',
            });
        });
        setFlights(flightEntries);

        // Satellites
        const satEntries: EntityEntry[] = [];
        store.satellites.forEach((entity, id) => {
            const props = entity.properties;
            const name = props?.name ?? props?._name ?? id;
            const height = props?.height ?? props?._height ?? '—';
            const orbit = props?.orbitType ?? props?._orbitType ?? '—';
            satEntries.push({
                id: entity.id || id,
                label: String(name),
                detail: `${typeof height === 'number' ? height.toFixed(0) : height} km · ${orbit}`,
                type: 'satellite',
            });
        });
        setSats(satEntries);

        // CCTV count -> cameras array
        const cameraEntries: CCTVCamera[] = [];
        store.cctvMarkers.forEach((entity, id) => {
            cameraEntries.push({
                id: entity.id || id,
                lat: 0,
                lon: 0,
                source_url: '',
                heading: 0,
                pitch: 0,
                label: entity.name || `Camera ${id}`,
            });
        });
        setCctvCameras(cameraEntries);
    }, [entityStoreRef]);

    useEffect(() => {
        const interval = setInterval(refreshData, 2000);
        refreshData();
        return () => clearInterval(interval);
    }, [refreshData]);

    const handleEntityClick = (entry: EntityEntry) => {
        selectEntity(entry.id, entry.type);
    };

    return (
        <>
            <AnimatePresence>
                {bottomPanelOpen && (
                    <motion.div
                        className="fixed bottom-2 left-2 right-2 z-30"
                        style={{ height: '200px' }}
                        initial={{ y: 220 }}
                        animate={{ y: 0 }}
                        exit={{ y: 220 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    >
                        <GlassPanel elevation="medium" className="h-full flex flex-col overflow-hidden">
                            {/* Tab header */}
                            <div className="flex items-center justify-between border-b border-white/8 px-2">
                                <div className="flex">
                                    {TABS.map((tab) => {
                                        const Icon = TAB_ICONS[tab];
                                        const count = tab === 'Flights' ? flights.length
                                            : tab === 'Satellites' ? sats.length
                                                : cctvCameras.length;
                                        return (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab
                                                    ? 'text-accent border-accent'
                                                    : 'text-white/50 border-transparent hover:text-white/70'
                                                    }`}
                                            >
                                                <Icon size={14} />
                                                {tab}
                                                {count > 0 && (
                                                    <span className="ml-1 text-[10px] opacity-60">{count}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={toggleBottomPanel}
                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                >
                                    <ChevronDown size={16} className="text-white/50" />
                                </button>
                            </div>

                            {/* Tab content */}
                            <div className="flex-1 overflow-y-auto p-3">
                                {activeTab === 'Flights' && (
                                    <div className="space-y-1">
                                        {flights.length === 0 ? (
                                            <div className="text-center py-8 text-white/20">
                                                <Plane size={32} className="mx-auto mb-2" />
                                                <p className="text-xs">Waiting for flight data...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-xs text-white/40 mb-2">
                                                    Live Flights: {flights.length}
                                                </p>
                                                {flights.slice(0, 50).map((entry) => (
                                                    <button
                                                        key={entry.id}
                                                        onClick={() => handleEntityClick(entry)}
                                                        className="w-full glass-panel-light p-2 mb-1 flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg transition-colors text-left"
                                                    >
                                                        <Plane size={14} className={entry.type === 'military' ? 'text-orange-400' : 'text-white/60'} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-white text-sm font-medium truncate">{entry.label}</div>
                                                            <div className="text-[10px] text-white/40 truncate">{entry.detail}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'Satellites' && (
                                    <div className="space-y-1">
                                        {sats.length === 0 ? (
                                            <div className="text-center py-8 text-white/20">
                                                <Satellite size={32} className="mx-auto mb-2" />
                                                <p className="text-xs">Waiting for satellite data...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-xs text-white/40 mb-2">
                                                    Active Satellites: {sats.length}
                                                </p>
                                                {sats.slice(0, 50).map((entry) => (
                                                    <button
                                                        key={entry.id}
                                                        onClick={() => handleEntityClick(entry)}
                                                        className="w-full glass-panel-light p-2 mb-1 flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg transition-colors text-left"
                                                    >
                                                        <Satellite size={14} className="text-white/60" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-white text-sm font-medium truncate">{entry.label}</div>
                                                            <div className="text-[10px] text-white/40 truncate">{entry.detail}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'CCTV' && (
                                    <CctvThumbnailGrid cameras={cctvCameras} />
                                )}
                            </div>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapsed Handle */}
            <AnimatePresence>
                {!bottomPanelOpen && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={toggleBottomPanel}
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 bg-black/40 backdrop-blur-md border border-white/10 border-b-0 rounded-t-xl px-6 py-1.5 hover:bg-white/10 transition-colors flex items-center gap-2 shadow-lg"
                        aria-label="Expand Data Panel"
                    >
                        <ChevronUp size={16} className="text-white/70" />
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Data Streams</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
