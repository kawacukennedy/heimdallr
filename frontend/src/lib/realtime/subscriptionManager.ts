// Subscription manager — tracks active channel subscriptions
import { getSupabaseClient } from './supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

const activeChannels = new Map<string, RealtimeChannel>();

export function subscribe(
    channelName: string,
    event: string,
    callback: (payload: any) => void
): RealtimeChannel {
    if (activeChannels.has(channelName)) unsubscribe(channelName);

    const supabase = getSupabaseClient();
    const channel = supabase
        .channel(channelName)
        .on('broadcast', { event }, ({ payload }) => callback(payload))
        .subscribe();

    activeChannels.set(channelName, channel);
    return channel;
}

export function subscribeToTable(
    tableName: string,
    callback: (payload: any) => void
): RealtimeChannel {
    const channelName = `table:${tableName}`;
    if (activeChannels.has(channelName)) unsubscribe(channelName);

    const supabase = getSupabaseClient();
    const channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, callback)
        .subscribe();

    activeChannels.set(channelName, channel);
    return channel;
}

export function unsubscribe(channelName: string) {
    const channel = activeChannels.get(channelName);
    if (channel) {
        getSupabaseClient().removeChannel(channel);
        activeChannels.delete(channelName);
    }
}

export function unsubscribeAll() {
    activeChannels.forEach((_, name) => unsubscribe(name));
}

export function getActiveChannels() {
    return Array.from(activeChannels.keys());
}
