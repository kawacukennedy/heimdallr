// Realtime types
export type { CivilianFlightPayload, MilitaryFlightPayload, SatellitePayload, CCTVPayload } from '@/lib/realtime/payloadTypes';

export interface RealtimeEvent<T = any> {
    event: string;
    payload: T;
    timestamp: number;
}

export interface ChannelState {
    name: string;
    status: 'connected' | 'disconnected' | 'reconnecting';
    lastMessageAt: number | null;
    messageCount: number;
}
