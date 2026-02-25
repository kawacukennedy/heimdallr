'use client';

import React, { useState, useEffect } from 'react';
import { Search, Settings } from 'lucide-react';
import GlassPanel from './GlassPanel';
import IconButton from './IconButton';
import FpsCounter from './FpsCounter';
import ConnectionStatus from './ConnectionStatus';
import { useUIStore } from '@/store/uiStore';

const SHADER_LABELS: Record<string, string> = {
    standard: 'STANDARD',
    nightVision: 'NIGHT VISION',
    thermal: 'THERMAL (FLIR)',
    crt: 'CRT MONITOR',
    edgeDetection: 'EDGE DETECT',
};

export default function TopBar() {
    const activeShader = useUIStore((s) => s.activeShader);
    const setSearchOpen = useUIStore((s) => s.setSearchOpen);
    const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
    const settings = useUIStore((s) => s.settings);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50" style={{ height: '60px' }}>
            <GlassPanel elevation="medium" rounded="sm" className="h-full mx-2 mt-2">
                <div className="flex items-center justify-between h-full px-4">
                    {/* Left section */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
                                <span className="text-accent font-bold text-xs">H</span>
                            </div>
                            <span className="font-bold text-white tracking-wider text-sm">HEIMDALLR</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            <span className="text-xs text-white/60 uppercase tracking-wider">Operational</span>
                        </div>
                    </div>

                    {/* Center section */}
                    <div className="flex items-center gap-6">
                        <div className="text-white/70 font-mono text-xs tracking-wider">
                            {time.toUTCString()}
                        </div>
                        {settings.showFPS && <FpsCounter />}
                        <div className="px-2 py-1 rounded bg-white/5 border border-white/10">
                            <span className="text-xs text-white/60 font-mono">
                                {SHADER_LABELS[activeShader] || 'STANDARD'}
                            </span>
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-2">
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
