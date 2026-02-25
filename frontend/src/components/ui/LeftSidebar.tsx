'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plane, Sword, Satellite, Camera, Car,
    Sun, Moon, Flame, Monitor,
    MapPin, Plus, ChevronLeft, ChevronRight, Trash2,
} from 'lucide-react';
import GlassPanel from './GlassPanel';
import IconButton from './IconButton';
import AddBookmarkModal from './AddBookmarkModal';
import { useUIStore } from '@/store/uiStore';
import { useCamera } from '@/hooks/useCamera';
import type { LayerKey, ShaderPreset } from '@/types';

const LAYER_ITEMS: Array<{ label: string; key: LayerKey; icon: React.ElementType }> = [
    { label: 'Civilian Flights', key: 'civilian', icon: Plane },
    { label: 'Military Flights', key: 'military', icon: Sword },
    { label: 'Satellites', key: 'satellites', icon: Satellite },
    { label: 'CCTV', key: 'cctv', icon: Camera },
    { label: 'Road Traffic', key: 'traffic', icon: Car },
];

const SHADER_ITEMS: Array<{ label: string; value: ShaderPreset; icon: React.ElementType }> = [
    { label: 'Standard', value: 'standard', icon: Sun },
    { label: 'Night Vision', value: 'nightVision', icon: Moon },
    { label: 'Thermal (FLIR)', value: 'thermal', icon: Flame },
    { label: 'CRT Monitor', value: 'crt', icon: Monitor },
];

function LayerToggle({ label, icon: Icon, checked, onChange }: {
    label: string; icon: React.ElementType; checked: boolean; onChange: () => void;
}) {
    return (
        <button
            onClick={onChange}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-button hover:bg-white/8 transition-colors"
        >
            <Icon size={16} className={checked ? 'text-accent' : 'text-white/40'} />
            <span className={`text-sm flex-1 text-left ${checked ? 'text-white' : 'text-white/40'}`}>
                {label}
            </span>
            <div className={`w-8 h-4 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-white/15'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform mt-[1px] ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
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
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-button transition-all ${selected ? 'bg-accent/15 border border-accent/30' : 'hover:bg-white/8 border border-transparent'
                }`}
        >
            <Icon size={16} className={selected ? 'text-accent' : 'text-white/50'} />
            <span className={`text-sm ${selected ? 'text-accent' : 'text-white/70'}`}>{label}</span>
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
                        className="fixed top-[76px] left-2 bottom-2 z-40"
                        style={{ width: '260px' }}
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    >
                        <GlassPanel elevation="medium" className="h-full flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Controls</span>
                                <button onClick={toggleSidebar} className="p-1 hover:bg-white/10 rounded">
                                    <ChevronLeft size={16} className="text-white/50" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                                {/* Layers */}
                                <div>
                                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 px-1">
                                        Layers
                                    </h3>
                                    <div className="space-y-0.5">
                                        {LAYER_ITEMS.map((item) => (
                                            <LayerToggle
                                                key={item.key}
                                                label={item.label}
                                                icon={item.icon}
                                                checked={layers[item.key]}
                                                onChange={() => toggleLayer(item.key)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Shader */}
                                <div>
                                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 px-1">
                                        Shader
                                    </h3>
                                    <div className="space-y-0.5">
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

                                {/* Bookmarks */}
                                <div>
                                    <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 px-1">
                                        Bookmarks
                                    </h3>
                                    <div className="space-y-0.5">
                                        {bookmarks.map((bm) => (
                                            <div
                                                key={bm.name}
                                                className="flex items-center gap-2 group"
                                            >
                                                <button
                                                    onClick={() => handleBookmarkClick(bm)}
                                                    className="flex items-center gap-3 flex-1 px-3 py-2 rounded-button hover:bg-white/8 transition-colors"
                                                >
                                                    <MapPin size={14} className="text-accent/60" />
                                                    <span className="text-sm text-white/70">{bm.name}</span>
                                                </button>
                                                <button
                                                    onClick={() => removeBookmark(bm.name)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-opacity"
                                                    aria-label={`Remove ${bm.name}`}
                                                >
                                                    <Trash2 size={12} className="text-white/30" />
                                                </button>
                                            </div>
                                        ))}
                                        <IconButton
                                            icon={Plus}
                                            variant="outline"
                                            className="w-full mt-2 text-xs"
                                            onClick={() => setBookmarkModalOpen(true)}
                                        >
                                            Add current...
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapsed toggle button */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={toggleSidebar}
                        className="fixed top-[76px] left-0 z-40 bg-black/40 backdrop-blur-md border border-white/10 border-l-0 rounded-r-lg p-2 hover:bg-white/10 transition-colors shadow-lg"
                        aria-label="Expand Sidebar"
                    >
                        <ChevronRight size={20} className="text-white/70" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Bookmark modal */}
            {bookmarkModalOpen && (
                <AddBookmarkModal isOpen={bookmarkModalOpen} onClose={() => setBookmarkModalOpen(false)} />
            )}
        </>
    );
}
