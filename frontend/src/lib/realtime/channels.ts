// Supabase Realtime channel configuration

export const CHANNELS = {
    CIVILIAN_FLIGHTS: 'flights:civilian',
    MILITARY_FLIGHTS: 'flights:military',
    CCTV: 'cctv',
} as const;

export const EVENTS = {
    UPDATE: 'update',
    INSERT: 'INSERT',
    UPDATE_ROW: 'UPDATE',
    DELETE: 'DELETE',
} as const;

export type ChannelName = (typeof CHANNELS)[keyof typeof CHANNELS];
export type EventName = (typeof EVENTS)[keyof typeof EVENTS];
