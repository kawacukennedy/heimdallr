'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Satellite, Camera, Anchor } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function RightPanel() {
    const rightPanelOpen = useUIStore((s) => s.rightPanelOpen);
    const toggleRightPanel = useUIStore((s) => s.toggleRightPanel);
    const selectedEntityId = useUIStore((s) => s.selectedEntityId);
    const selectedEntityType = useUIStore((s) => s.selectedEntityType);
    const activeShader = useUIStore((s) => s.activeShader);
    const setShader = useUIStore((s) => s.setShader);
    const shaderSettings = useSettingsStore((s) => s.shaderSettings);
    const updateShaderSetting = useSettingsStore((s) => s.updateShaderSetting);

    // Demo geo readouts (would come from camera in real use)
    const [geoData, setGeoData] = useState({
        gsd: '0.08M',
        nirs: '8.4',
        alt: '214M',
        sun: '-24.9°',
    });

    const shaders = [
        { label: 'STANDARD', value: 'standard' },
        { label: 'NV-GEN3', value: 'nightVision' },
        { label: 'FLIR-TH', value: 'thermal' },
        { label: 'CRT', value: 'crt' },
    ];

    const renderEntityContent = () => {
        if (!selectedEntityId) {
            return (
                <div className="px-3 py-4 text-center">
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider">
                        SELECT ENTITY FOR DETAILS
                    </p>
                </div>
            );
        }

        const iconMap: Record<string, React.ReactNode> = {
            flight: <Plane size={12} className="text-white/60" />,
            military: <Plane size={12} className="text-amber-400" />,
            satellite: <Satellite size={12} className="text-amber-400/70" />,
            cctv: <Camera size={12} className="text-cyan-400" />,
            ship: <Anchor size={12} className="text-blue-400" />,
        };

        return (
            <div className="px-3 py-2 space-y-1.5">
                <div className="flex items-center gap-2 mb-2">
                    {iconMap[selectedEntityType || ''] || null}
                    <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider">{selectedEntityType} Details</span>
                </div>
                <DetailRow label="ENTITY ID" value={selectedEntityId} />
                <DetailRow label="TYPE" value={selectedEntityType?.toUpperCase() || 'N/A'} />
                <div className="pt-1">
                    <div className="text-[8px] font-mono text-white/20 uppercase tracking-wider">
                        TELEMETRY AVAIL ON LIVE FEED
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {rightPanelOpen && (
                <motion.div
                    className="fixed top-[52px] right-1 bottom-1 z-30"
                    style={{ width: '240px' }}
                    initial={{ x: 260 }}
                    animate={{ x: 0 }}
                    exit={{ x: 260 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <GlassPanel elevation="medium" className="h-full flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                            <span className="tac-label">INTEL PANEL</span>
                            <button onClick={toggleRightPanel} className="p-0.5 hover:bg-white/[0.06] rounded-sm">
                                <X size={12} className="text-white/30" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {/* Entity details */}
                            {renderEntityContent()}

                            {/* Divider */}
                            <div className="mx-3 border-t border-white/[0.06]" />

                            {/* PARAMETERS section */}
                            <div className="px-3 py-2">
                                <h3 className="tac-label mb-2">PARAMETERS</h3>
                                <div className="space-y-2">
                                    <ParameterSlider
                                        label="Pixelation"
                                        value={shaderSettings.scanlineIntensity * 100}
                                        onChange={(v) => updateShaderSetting('scanlineIntensity', v / 100)}
                                    />
                                    <ParameterSlider
                                        label="Distortion"
                                        value={shaderSettings.chromaticAberration * 20000}
                                        onChange={(v) => updateShaderSetting('chromaticAberration', v / 20000)}
                                    />
                                    <ParameterSlider
                                        label="Instability"
                                        value={shaderSettings.noiseAmount * 100}
                                        onChange={(v) => updateShaderSetting('noiseAmount', v / 100)}
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mx-3 border-t border-white/[0.06]" />

                            {/* Style Preset */}
                            <div className="px-3 py-2">
                                <h3 className="tac-label mb-2">STYLE PRESET</h3>
                                <div className="flex flex-wrap gap-1">
                                    {shaders.map((s) => (
                                        <button
                                            key={s.value}
                                            onClick={() => setShader(s.value as any)}
                                            className={`px-2 py-1 text-[8px] font-mono tracking-wider uppercase transition-all ${activeShader === s.value
                                                ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                                                : 'bg-white/[0.03] border border-white/[0.08] text-white/35 hover:text-white/50'
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mx-3 border-t border-white/[0.06]" />

                            {/* Geo readouts */}
                            <div className="px-3 py-2">
                                <h3 className="tac-label mb-2">SENSOR DATA</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-[9px] font-mono text-white/30">GSD:</span>
                                        <span className="text-[9px] font-mono text-white/60">{geoData.gsd} NIRS: {geoData.nirs}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[9px] font-mono text-white/30">ALT:</span>
                                        <span className="text-[9px] font-mono text-white/60">{geoData.alt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[9px] font-mono text-white/30">SUN:</span>
                                        <span className="text-[9px] font-mono text-white/60">{geoData.sun} EL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-0.5">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{label}</span>
            <span className="text-[9px] font-mono text-white/65 truncate max-w-[140px]">{value}</span>
        </div>
    );
}

function ParameterSlider({ label, value, onChange }: {
    label: string; value: number; onChange: (v: number) => void;
}) {
    return (
        <div className="space-y-0.5">
            <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-wider">{label}</span>
                <span className="text-[8px] font-mono text-cyan-400/60">{Math.round(value)}%</span>
            </div>
            <div className="relative h-2 bg-white/[0.04] rounded-sm overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-cyan-500/30 transition-all"
                    style={{ width: `${Math.min(100, value)}%` }}
                />
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Thumb indicator */}
                <div
                    className="absolute top-0 h-full w-1 bg-cyan-400/80"
                    style={{ left: `${Math.min(100, value)}%` }}
                />
            </div>
        </div>
    );
}
