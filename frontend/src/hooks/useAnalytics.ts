'use client';

import { useCallback } from 'react';
import { getSupabaseClient } from '@/lib/realtime/supabaseClient';

type AnalyticsEventType =
    | 'layer_toggle'
    | 'shader_change'
    | 'entity_select'
    | 'search'
    | 'bookmark_create'
    | 'bookmark_navigate'
    | 'camera_fly'
    | 'settings_change'
    | 'page_view'
    | 'error';

interface AnalyticsEvent {
    event_type: AnalyticsEventType;
    properties?: Record<string, any>;
}

export function useAnalytics() {
    const trackEvent = useCallback(async (event: AnalyticsEvent) => {
        try {
            const supabase = getSupabaseClient();

            await supabase.from('analytics_events').insert({
                event_type: event.event_type,
                properties: event.properties || {},
            });
        } catch (error) {
            // Silently fail — analytics should never break the app
            if (process.env.NODE_ENV === 'development') {
                console.debug('[Analytics]', event.event_type, event.properties);
            }
        }
    }, []);

    const trackLayerToggle = useCallback(
        (layer: string, enabled: boolean) => {
            trackEvent({ event_type: 'layer_toggle', properties: { layer, enabled } });
        },
        [trackEvent]
    );

    const trackShaderChange = useCallback(
        (shader: string) => {
            trackEvent({ event_type: 'shader_change', properties: { shader } });
        },
        [trackEvent]
    );

    const trackEntitySelect = useCallback(
        (entityId: string, entityType: string) => {
            trackEvent({ event_type: 'entity_select', properties: { entityId, entityType } });
        },
        [trackEvent]
    );

    const trackSearch = useCallback(
        (query: string, resultCount: number) => {
            trackEvent({ event_type: 'search', properties: { query, resultCount } });
        },
        [trackEvent]
    );

    const trackError = useCallback(
        (error: string, context?: string) => {
            trackEvent({ event_type: 'error', properties: { error, context } });
        },
        [trackEvent]
    );

    return {
        trackEvent,
        trackLayerToggle,
        trackShaderChange,
        trackEntitySelect,
        trackSearch,
        trackError,
    };
}
