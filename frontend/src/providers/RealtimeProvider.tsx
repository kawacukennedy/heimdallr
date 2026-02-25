'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient } from '@/lib/realtime/supabaseClient';
import { useUIStore } from '@/store/uiStore';

interface RealtimeContextType {
    isConnected: boolean;
    latency: number;
}

const RealtimeContext = createContext<RealtimeContextType>({
    isConnected: false,
    latency: 0,
});

export function RealtimeProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [latency, setLatency] = useState(0);
    const setConnectionStatus = useUIStore((s) => s.setConnectionStatus);

    useEffect(() => {
        const supabase = getSupabaseClient();

        // Track connection status
        const statusChannel = supabase.channel('heimdallr-status');

        statusChannel
            .on('broadcast', { event: 'ping' }, () => {
                const start = performance.now();
                statusChannel.send({ type: 'broadcast', event: 'pong', payload: {} }).then(() => {
                    const elapsed = performance.now() - start;
                    setLatency(Math.round(elapsed));
                });
            })
            .subscribe((status) => {
                const connected = status === 'SUBSCRIBED';
                setIsConnected(connected);
                setConnectionStatus(connected, latency);
            });

        // Ping interval for latency
        const interval = setInterval(() => {
            statusChannel.send({ type: 'broadcast', event: 'ping', payload: {} });
        }, 30000);

        return () => {
            clearInterval(interval);
            supabase.removeChannel(statusChannel);
        };
    }, [setConnectionStatus, latency]);

    return (
        <RealtimeContext.Provider value={{ isConnected, latency }}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtimeContext(): RealtimeContextType {
    return useContext(RealtimeContext);
}
