'use client';

import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function ConnectionStatus() {
    const isConnected = useUIStore((s) => s.isConnected);
    const wsLatency = useUIStore((s) => s.wsLatency);

    return (
        <div className="flex items-center gap-1.5 px-1.5 py-0.5">
            {isConnected ? (
                <>
                    <Wifi size={10} className="text-green-400/70" />
                    <span className="text-[8px] text-green-400/50 font-mono tracking-wider">{wsLatency}MS</span>
                </>
            ) : (
                <>
                    <WifiOff size={10} className="text-red-400/70" />
                    <span className="text-[8px] text-red-400/60 font-mono tracking-wider">DISCONN</span>
                </>
            )}
        </div>
    );
}
