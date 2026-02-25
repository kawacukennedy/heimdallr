'use client';

import { useEffect, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/realtime/supabaseClient';

export function useRealtimeSubscription(
    channelName: string,
    event: string,
    callback: (payload: any) => void
) {
    const stableCallback = useCallback(callback, [callback]);

    useEffect(() => {
        const supabase = getSupabaseClient();
        const channel = supabase
            .channel(channelName)
            .on('broadcast', { event }, (msg: any) => {
                stableCallback(msg.payload);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [channelName, event, stableCallback]);
}
