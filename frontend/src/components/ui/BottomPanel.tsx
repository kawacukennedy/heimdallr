'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Satellite, Camera, Anchor, ChevronDown, ChevronUp } from 'lucide-react';
import GlassPanel from './GlassPanel';
import CctvThumbnailGrid from './CctvThumbnailGrid';
import { useUIStore } from '@/store/uiStore';
import { useCesiumContext } from '@/providers/CesiumProvider';
import type { CCTVCamera } from '@/types';

const TABS = ['Flights', 'Satellites', 'Ships', 'CCTV'] as const;
type TabName = (typeof TABS)[number];

const TAB_ICONS: Record<TabName, React.ElementType> = {
    Flights: Plane,
    Satellites: Satellite,
    Ships: Anchor,
    CCTV: Camera,
};

const TAB_COLORS: Record<TabName, string> = {
    Flights: 'text-white/60',
    Satellites: 'text-amber-400/70',
    Ships: 'text-blue-400/70',
    CCTV: 'text-cyan-400/70',
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
    const [ships, setShips] = useState<EntityEntry[]>([]);
    const [cctvCameras, setCctvCameras] = useState<CCTVCamera[]>([]);

    const refreshData = useCallback(() => {
        const store = entityStoreRef.current;

        // Flights
        const flightEntries: EntityEntry[] = [];
        store.civilianFlights.forEach((entity, id) => {
            const props = entity.properties;
            const callsign = String(props?.callsign ?? props?._callsign ?? id);
            const alt = String(props?.alt ?? props?._alt ?? '—');
            const velocity = String(props?.velocity ?? props?._velocity ?? '—');
            flightEntries.push({
                id: entity.id || `civilian-${id}`,
                label: callsign,
                detail: `${alt}m · ${velocity}m/s`,
                type: 'flight',
            });
        });
        store.militaryFlights.forEach((entity, id) => {
            const props = entity.properties;
            const callsign = String(props?.callsign ?? props?._callsign ?? id);
            const alt = String(props?.alt ?? props?._alt ?? '—');
            flightEntries.push({
                id: entity.id || `military-${id}`,
                label: `⚔ ${callsign}`,
                detail: `${alt}m · MIL`,
                type: 'military',
            });
        });
        setFlights(flightEntries);

        // Satellites
        const satEntries: EntityEntry[] = [];
        store.satellites.forEach((entity, id) => {
            const props = entity.properties;
            const name = String(props?.name ?? props?._name ?? id);
            const height = props?.height ?? props?._height ?? '—';
            satEntries.push({
                id: entity.id || id,
                label: name,
                detail: `${typeof height === 'number' ? height.toFixed(0) : String(height)}km`,
                type: 'satellite',
            });
        });
        setSats(satEntries);

        // CCTV
        const cameraEntries: CCTVCamera[] = [];
        store.cctvMarkers.forEach((entity, id) => {
            cameraEntries.push({
                id: entity.id || id,
                lat: 0, lon: 0, source_url: '', heading: 0, pitch: 0,
                label: entity.name || `CAM-${id}`,
            });
        });
        setCctvCameras(cameraEntries);

        // Ships
        const shipEntries: EntityEntry[] = [];
        if (store.ships) {
            store.ships.forEach((entity: any, id: string) => {
                const props = entity.properties;
                const name = String(props?.name ?? props?._name ?? id);
                const speed = String(props?.speed ?? props?._speed ?? '—');
                const dest = String(props?.destination ?? props?._destination ?? '—');
                shipEntries.push({
                    id: entity.id || `ship-${id}`,
                    label: name,
                    detail: `${speed}kn · ${dest}`,
                    type: 'ship',
                });
            });
        }
        setShips(shipEntries);
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
                        className="fixed bottom-1 left-1 right-1 z-30"
                        style={{ height: '180px' }}
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <GlassPanel elevation="medium" className="h-full flex flex-col overflow-hidden">
                            {/* Tab header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-1">
                                <div className="flex">
                                    {TABS.map((tab) => {
                                        const Icon = TAB_ICONS[tab];
                                        const count = tab === 'Flights' ? flights.length
                                            : tab === 'Satellites' ? sats.length
                                                : tab === 'Ships' ? ships.length
                                                    : cctvCameras.length;
                                        return (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`flex items-center gap-1.5 px-3 py-2 text-[8px] font-mono font-medium uppercase tracking-[0.15em] transition-colors border-b ${activeTab === tab
                                                    ? 'text-cyan-300 border-cyan-400'
                                                    : 'text-white/30 border-transparent hover:text-white/50'
                                                    }`}
                                            >
                                                <Icon size={10} />
                                                {tab}
                                                {count > 0 && (
                                                    <span className={`text-[8px] ${activeTab === tab ? 'text-cyan-400/60' : 'text-white/20'}`}>
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={toggleBottomPanel}
                                    className="p-1 hover:bg-white/[0.04] rounded-sm transition-colors"
                                >
                                    <ChevronDown size={12} className="text-white/30" />
                                </button>
                            </div>

                            {/* Tab content */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {activeTab === 'Flights' && (
                                    <EntityList
                                        entries={flights}
                                        emptyIcon={Plane}
                                        emptyText="AWAITING FLIGHT DATA"
                                        onEntityClick={handleEntityClick}
                                        iconColor={(e) => e.type === 'military' ? 'text-amber-400/70' : 'text-white/35'}
                                    />
                                )}
                                {activeTab === 'Satellites' && (
                                    <EntityList
                                        entries={sats}
                                        emptyIcon={Satellite}
                                        emptyText="AWAITING SATELLITE DATA"
                                        onEntityClick={handleEntityClick}
                                        iconColor={() => 'text-amber-400/50'}
                                    />
                                )}
                                {activeTab === 'Ships' && (
                                    <EntityList
                                        entries={ships}
                                        emptyIcon={Anchor}
                                        emptyText="AWAITING AIS SHIP DATA"
                                        onEntityClick={handleEntityClick}
                                        iconColor={() => 'text-blue-400/60'}
                                    />
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
                        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-sm border border-white/[0.06] border-b-0 rounded-t-sm px-4 py-1 hover:bg-white/[0.04] transition-colors flex items-center gap-2"
                        aria-label="Expand Data Panel"
                    >
                        <ChevronUp size={12} className="text-white/40" />
                        <span className="text-[7px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">DATA STREAMS</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}

function EntityList({
    entries, emptyIcon: Icon, emptyText, onEntityClick, iconColor,
}: {
    entries: EntityEntry[];
    emptyIcon: React.ElementType;
    emptyText: string;
    onEntityClick: (e: EntityEntry) => void;
    iconColor: (e: EntityEntry) => string;
}) {
    if (entries.length === 0) {
        return (
            <div className="text-center py-6 text-white/15">
                <Icon size={20} className="mx-auto mb-1" />
                <p className="text-[8px] font-mono tracking-wider">{emptyText}</p>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            <div className="text-[7px] font-mono text-white/25 uppercase tracking-wider mb-1 px-1">
                LIVE: {entries.length}
            </div>
            {entries.slice(0, 50).map((entry) => (
                <button
                    key={entry.id}
                    onClick={() => onEntityClick(entry)}
                    className="w-full flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-white/[0.04] transition-colors text-left"
                >
                    <Plane size={9} className={iconColor(entry)} />
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-white/60 truncate">
                            {typeof entry.label === 'object' && entry.label !== null ? JSON.stringify(entry.label) : String(entry.label)}
                        </span>
                        <span className="text-[8px] font-mono text-white/25 truncate ml-2">
                            {typeof entry.detail === 'object' && entry.detail !== null ? JSON.stringify(entry.detail) : String(entry.detail)}
                        </span>
                    </div>
                    {/* Status bar */}
                    <div className="w-8 h-[2px] bg-white/[0.06] overflow-hidden">
                        <div
                            className="h-full bg-cyan-500/40"
                            style={{ width: `${30 + Math.random() * 70}%` }}
                        />
                    </div>
                </button>
            ))}
        </div>
    );
}
