'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Settings } from 'lucide-react';
import GlassPanel from './GlassPanel';
import IconButton from './IconButton';
import FpsCounter from './FpsCounter';
import ConnectionStatus from './ConnectionStatus';
import { useUIStore } from '@/store/uiStore';
import { useCesiumContext } from '@/providers/CesiumProvider';

const SHADER_LABELS: Record<string, string> = {
    standard: 'STANDARD',
    nightVision: 'NV-GEN3',
    thermal: 'FLIR-TH',
    crt: 'CRT',
    edgeDetection: 'EDGE-DET',
};

export default function TopBar() {
    const activeShader = useUIStore((s) => s.activeShader);
    const setSearchOpen = useUIStore((s) => s.setSearchOpen);
    const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
    const settings = useUIStore((s) => s.settings);
    const [time, setTime] = useState(new Date());
    const { entityStoreRef } = useCesiumContext();
    const [entityCounts, setEntityCounts] = useState({
        flights: 0, military: 0, sats: 0, ships: 0
    });

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Entity count ticker
    useEffect(() => {
        const countInterval = setInterval(() => {
            const store = entityStoreRef.current;
            setEntityCounts({
                flights: store.civilianFlights.size,
                military: store.militaryFlights.size,
                sats: store.satellites.size,
                ships: store.ships.size,
            });
        }, 2000);
        return () => clearInterval(countInterval);
    }, [entityStoreRef]);

    const utcStr = time.toISOString().replace('T', ' ').slice(0, 19) + 'Z';
    const dateStr = time.toISOString().slice(0, 10).replace(/-/g, '-');

    return (
        <div className="fixed top-0 left-0 right-0 z-50" style={{ height: '44px' }}>
            <GlassPanel elevation="medium" className="h-full mx-1 mt-1">
                <div className="flex items-center justify-between h-full px-3">
                    {/* Left: WORLDVIEW branding + metrics */}
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full border border-cyan-400/40 flex items-center justify-center">
                                <span className="text-cyan-400 font-bold text-[9px]">⊕</span>
                            </div>
                            <div className="leading-none">
                                <div className="text-[11px] font-bold tracking-[0.2em] text-cyan-300">WORLDVIEW</div>
                                <div className="text-[7px] tracking-[0.15em] text-white/25 uppercase">We Place Left Behind</div>
                            </div>
                        </div>

                        <span className="tac-divider" />

                        {/* Metrics strip */}
                        <div className="flex items-center gap-3 text-[9px] font-mono tracking-wider">
                            <span className="text-white/35">PHOTINT</span>
                            <span className="tac-accent">VG5:5</span>
                            <span className="tac-divider" />
                            <span className="text-white/35">SHC:</span>
                            <span className="text-white/60">3a</span>
                            <span className="tac-divider" />
                            <span className="text-white/35">TRK:</span>
                            <span className="tac-accent">{entityCounts.flights + entityCounts.military}</span>
                            <span className="tac-divider" />
                            <span className="text-white/35">SAT:</span>
                            <span className="text-white/60">{entityCounts.sats}</span>
                            <span className="tac-divider" />
                            <span className="text-white/35">AIS:</span>
                            <span className="tac-accent">{entityCounts.ships}</span>
                        </div>
                    </div>

                    {/* Center: UTC time + FPS */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="rec-dot" />
                            <span className="text-[9px] font-mono text-red-400/80 tracking-wider">REC</span>
                        </div>
                        <div className="text-white/50 font-mono text-[10px] tracking-wider">
                            {utcStr}
                        </div>
                        {settings.showFPS && <FpsCounter />}
                    </div>

                    {/* Right: Shader + Actions */}
                    <div className="flex items-center gap-3">
                        {/* Data readouts */}
                        <div className="flex items-center gap-3 text-[9px] font-mono tracking-wider">
                            <span className="text-white/30">ORB:</span>
                            <span className="text-white/55">476Fn</span>
                            <span className="text-white/30">PASS:</span>
                            <span className="text-white/55">DISC:204</span>
                        </div>

                        <span className="tac-divider" />

                        {/* Active shader */}
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] text-white/30 tracking-widest">ACTIVE STYLE</span>
                            <span className="text-[10px] font-bold tac-accent tracking-wider">
                                {SHADER_LABELS[activeShader] || 'STANDARD'}
                            </span>
                        </div>

                        <span className="tac-divider" />

                        <IconButton
                            icon={Search}
                            onClick={() => setSearchOpen(true)}
                            tooltip="Search (/)"
                            aria-label="Search"
                        />
                        <IconButton
                            icon={Settings}
                            onClick={() => setSettingsOpen(true)}
                            tooltip="Settings"
                            aria-label="Settings"
                        />
                        <ConnectionStatus />
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
}
