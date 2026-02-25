// Supabase data service – queries Supabase directly from the frontend

import { getSupabaseClient } from '@/lib/realtime/supabaseClient';
import type { CCTVCamera, TLESnapshot } from '@/types';

export async function fetchCctvCameras(): Promise<CCTVCamera[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('cctv_cameras')
        .select('id, lat, lon, source_url, heading, pitch, city, label')
        .order('city');

    if (error) throw new Error(error.message);
    return (data as CCTVCamera[]) || [];
}

export async function fetchLatestTLE(): Promise<TLESnapshot | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('tle_snapshots')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.warn('No TLE data available:', error.message);
        return null;
    }
    return data as TLESnapshot;
}

export async function fetchUserProfile(userId: string) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateUserProfile(
    userId: string,
    updates: { display_name?: string; avatar_url?: string; settings?: any; bookmarks?: any }
) {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function trackAnalyticsEvent(eventType: string, properties: Record<string, any> = {}) {
    const supabase = getSupabaseClient();
    await supabase.from('analytics_events').insert({
        event_type: eventType,
        properties,
    });
}
