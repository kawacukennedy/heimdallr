'use client';

import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function ConnectionStatus() {
    const isConnected = useUIStore((s) => s.isConnected);
    const wsLatency = useUIStore((s) => s.wsLatency);

    return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-button">
            {isConnected ? (
                <>
                    <Wifi size={14} className="text-success" />
                    <span className="text-xs text-white/60 font-mono">{wsLatency}ms</span>
                </>
            ) : (
                <>
                    <WifiOff size={14} className="text-danger" />
                    <span className="text-xs text-danger/80">Offline</span>
                </>
            )}
        </div>
    );
}
