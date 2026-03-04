'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plane, Sword, Satellite, Camera, Car,
    Sun, Moon, Flame, Monitor,
    MapPin, Plus, ChevronLeft, ChevronRight, Trash2,
    Anchor, ShieldAlert, Clock,
} from 'lucide-react';
import GlassPanel from './GlassPanel';
import IconButton from './IconButton';
import AddBookmarkModal from './AddBookmarkModal';
import { useUIStore } from '@/store/uiStore';
import { useCamera } from '@/hooks/useCamera';
import type { LayerKey, ShaderPreset } from '@/types';

const LAYER_ITEMS: Array<{ label: string; key: LayerKey; icon: React.ElementType; color: string }> = [
    { label: 'CIV FLIGHTS', key: 'civilian', icon: Plane, color: '#d0d8e0' },
    { label: 'MIL FLIGHTS', key: 'military', icon: Sword, color: '#ff9f0a' },
    { label: 'SATELLITES', key: 'satellites', icon: Satellite, color: '#c8a64b' },
    { label: 'CCTV', key: 'cctv', icon: Camera, color: '#00e5ff' },
    { label: 'ROAD NET', key: 'traffic', icon: Car, color: '#30d158' },
    { label: 'SHIPS AIS', key: 'ships', icon: Anchor, color: '#0099ff' },
    { label: 'GPS JAMMING', key: 'gpsJamming', icon: ShieldAlert, color: '#ff453a' },
];

const SHADER_ITEMS: Array<{ label: string; value: ShaderPreset; icon: React.ElementType }> = [
    { label: 'STANDARD', value: 'standard', icon: Sun },
    { label: 'NV-GEN3', value: 'nightVision', icon: Moon },
    { label: 'FLIR-TH', value: 'thermal', icon: Flame },
    { label: 'CRT', value: 'crt', icon: Monitor },
];

function LayerToggle({ label, icon: Icon, checked, onChange, color }: {
    label: string; icon: React.ElementType; checked: boolean; onChange: () => void; color: string;
}) {
    return (
        <button
            onClick={onChange}
            className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-white/[0.04] transition-colors"
        >
            <Icon size={12} style={{ color: checked ? color : 'rgba(160,180,200,0.25)' }} />
            <span className={`text-[9px] font-mono tracking-wider flex-1 text-left uppercase ${checked ? 'text-white/70' : 'text-white/25'}`}>
                {label}
            </span>
            <div className={`w-6 h-3 rounded-sm transition-colors ${checked ? 'bg-cyan-500/40 border border-cyan-500/50' : 'bg-white/[0.06] border border-white/10'}`}>
                <div className={`w-2.5 h-2.5 rounded-sm bg-white/90 transition-transform mt-[0.5px] ${checked ? 'translate-x-3' : 'translate-x-0'}`} />
            </div>
        </button>
    );
}

function ShaderSelector({ label, icon: Icon, selected, onClick }: {
    label: string; icon: React.ElementType; selected: boolean; onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 w-full px-2 py-1.5 transition-all text-[9px] font-mono tracking-wider uppercase ${selected
                    ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400 text-cyan-300'
                    : 'hover:bg-white/[0.04] text-white/35 border-l-2 border-l-transparent'
                }`}
        >
            <Icon size={11} className={selected ? 'text-cyan-400' : 'text-white/25'} />
            <span>{label}</span>
        </button>
    );
}

export default function LeftSidebar() {
    const sidebarOpen = useUIStore((s) => s.sidebarOpen);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);
    const layers = useUIStore((s) => s.layers);
    const toggleLayer = useUIStore((s) => s.toggleLayer);
    const activeShader = useUIStore((s) => s.activeShader);
    const setShader = useUIStore((s) => s.setShader);
    const bookmarks = useUIStore((s) => s.bookmarks);
    const removeBookmark = useUIStore((s) => s.removeBookmark);
    const setPlaybackMode = useUIStore((s: any) => s.setPlaybackMode);
    const { flyTo } = useCamera();
    const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);

    const handleBookmarkClick = (bookmark: { name: string; camera: { longitude: number; latitude: number; height: number } }) => {
        flyTo(bookmark.camera);
    };

    return (
        <>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="fixed top-[52px] left-1 bottom-1 z-40"
                        style={{ width: '220px' }}
                        initial={{ x: -240 }}
                        animate={{ x: 0 }}
                        exit={{ x: -240 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <GlassPanel elevation="medium" className="h-full flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                                <span className="tac-label">LAYERS & CONTROL</span>
                                <button onClick={toggleSidebar} className="p-0.5 hover:bg-white/[0.06] rounded-sm">
                                    <ChevronLeft size={12} className="text-white/30" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-3">
                                {/* Layers */}
                                <div>
                                    <h3 className="tac-label mb-1 px-1">DATA LAYERS</h3>
                                    <div className="space-y-0">
                                        {LAYER_ITEMS.map((item) => (
                                            <LayerToggle
                                                key={item.key}
                                                label={item.label}
                                                icon={item.icon}
                                                checked={layers[item.key]}
                                                onChange={() => toggleLayer(item.key)}
                                                color={item.color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Style Preset */}
                                <div>
                                    <h3 className="tac-label mb-1 px-1">STYLE PRESET</h3>
                                    <div className="space-y-0">
                                        {SHADER_ITEMS.map((item) => (
                                            <ShaderSelector
                                                key={item.value}
                                                label={item.label}
                                                icon={item.icon}
                                                selected={activeShader === item.value}
                                                onClick={() => setShader(item.value)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* 4D Playback */}
                                <div>
                                    <h3 className="tac-label mb-1 px-1">4D PLAYBACK</h3>
                                    <button
                                        onClick={() => setPlaybackMode(true)}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-[9px] font-mono tracking-wider uppercase text-cyan-400/70 hover:bg-cyan-500/10 transition-colors border border-cyan-500/20 rounded-sm"
                                    >
                                        <Clock size={11} className="text-cyan-400/60" />
                                        <span>ENTER PLAYBACK MODE</span>
                                    </button>
                                </div>

                                {/* Bookmarks */}
                                <div>
                                    <h3 className="tac-label mb-1 px-1">WAYPOINTS</h3>
                                    <div className="space-y-0">
                                        {bookmarks.map((bm) => (
                                            <div key={bm.name} className="flex items-center gap-1 group">
                                                <button
                                                    onClick={() => handleBookmarkClick(bm)}
                                                    className="flex items-center gap-2 flex-1 px-2 py-1.5 hover:bg-white/[0.04] transition-colors"
                                                >
                                                    <MapPin size={10} className="text-amber-400/50" />
                                                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">{bm.name}</span>
                                                </button>
                                                <button
                                                    onClick={() => removeBookmark(bm.name)}
                                                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/[0.06] rounded-sm transition-opacity"
                                                    aria-label={`Remove ${bm.name}`}
                                                >
                                                    <Trash2 size={9} className="text-white/20" />
                                                </button>
                                            </div>
                                        ))}
                                        <IconButton
                                            icon={Plus}
                                            variant="outline"
                                            className="w-full mt-1 text-[8px]"
                                            onClick={() => setBookmarkModalOpen(true)}
                                        >
                                            ADD CURRENT
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapsed toggle */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={toggleSidebar}
                        className="fixed top-[52px] left-0 z-40 bg-black/50 backdrop-blur-sm border border-white/[0.06] border-l-0 rounded-r-sm p-1.5 hover:bg-white/[0.06] transition-colors"
                        aria-label="Expand Sidebar"
                    >
                        <ChevronRight size={14} className="text-white/40" />
                    </motion.button>
                )}
            </AnimatePresence>

            {bookmarkModalOpen && (
                <AddBookmarkModal isOpen={bookmarkModalOpen} onClose={() => setBookmarkModalOpen(false)} />
            )}
        </>
    );
}
