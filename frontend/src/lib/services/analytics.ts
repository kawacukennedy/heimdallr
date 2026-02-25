// Analytics service
import { getSupabaseClient } from '@/lib/realtime/supabaseClient';

export async function trackAnalyticsEvent(eventType: string, properties: Record<string, any> = {}) {
    try {
        await getSupabaseClient().from('analytics_events').insert({ event_type: eventType, properties });
    } catch { /* swallow — analytics must never break the app */ }
}

export async function getAnalyticsSummary(period: '24h' | '7d' | '30d' = '24h') {
    const ms = { '24h': 86400000, '7d': 604800000, '30d': 2592000000 }[period];
    const since = new Date(Date.now() - ms).toISOString();
    const supabase = getSupabaseClient();
    const { data } = await supabase.from('analytics_events').select('event_type').gte('created_at', since);
    const counts: Record<string, number> = {};
    (data || []).forEach((row: any) => { counts[row.event_type] = (counts[row.event_type] || 0) + 1; });
    return { period, total: data?.length || 0, byType: counts };
}
