'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Satellite, Camera } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { useUIStore } from '@/store/uiStore';

export default function RightPanel() {
    const rightPanelOpen = useUIStore((s) => s.rightPanelOpen);
    const toggleRightPanel = useUIStore((s) => s.toggleRightPanel);
    const selectedEntityId = useUIStore((s) => s.selectedEntityId);
    const selectedEntityType = useUIStore((s) => s.selectedEntityType);

    const renderContent = () => {
        if (!selectedEntityId) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-white/30 px-6">
                    <p className="text-sm text-center">
                        Select an entity on the map to see details here.
                    </p>
                </div>
            );
        }

        switch (selectedEntityType) {
            case 'flight':
                return (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <Plane size={18} className="text-white" />
                            <h3 className="text-lg font-semibold text-white">Flight Details</h3>
                        </div>
                        <DetailRow label="Entity ID" value={selectedEntityId} />
                        <DetailRow label="Type" value="Civilian Flight" />
                        <p className="text-xs text-white/40 mt-4">
                            Detailed telemetry appears when connected to live data.
                        </p>
                    </div>
                );

            case 'military':
                return (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <Plane size={18} className="text-orange-400" />
                            <h3 className="text-lg font-semibold text-white">Military Flight</h3>
                        </div>
                        <DetailRow label="Entity ID" value={selectedEntityId} />
                        <DetailRow label="Type" value="Military" />
                    </div>
                );

            case 'satellite':
                return (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <Satellite size={18} className="text-yellow-400" />
                            <h3 className="text-lg font-semibold text-white">Satellite Details</h3>
                        </div>
                        <DetailRow label="Entity ID" value={selectedEntityId} />
                        <DetailRow label="Type" value="Satellite" />
                    </div>
                );

            case 'cctv':
                return (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <Camera size={18} className="text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">CCTV Feed</h3>
                        </div>
                        <div className="w-full aspect-video rounded-lg bg-black/50 border border-white/10 flex items-center justify-center">
                            <Camera size={32} className="text-white/20" />
                        </div>
                        <DetailRow label="Camera ID" value={selectedEntityId} />
                        <button className="w-full mt-3 px-4 py-2 bg-accent/15 border border-accent/30 rounded-button text-accent text-sm hover:bg-accent/25 transition-colors">
                            Apply to buildings
                        </button>
                    </div>
                );

            default:
                return (
                    <div className="p-4">
                        <DetailRow label="Entity ID" value={selectedEntityId} />
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            {rightPanelOpen && (
                <motion.div
                    className="fixed top-[76px] right-2 bottom-[216px] z-30"
                    style={{ width: '300px' }}
                    initial={{ x: 320 }}
                    animate={{ x: 0 }}
                    exit={{ x: 320 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                >
                    <GlassPanel elevation="medium" className="h-full flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                                Details
                            </span>
                            <button
                                onClick={toggleRightPanel}
                                className="p-1 hover:bg-white/10 rounded"
                            >
                                <X size={16} className="text-white/50" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
                    </GlassPanel>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
            <span className="text-xs text-white/50">{label}</span>
            <span className="text-xs text-white/90 font-mono">{value}</span>
        </div>
    );
}
