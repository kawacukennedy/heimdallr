// Realtime configuration
export const REALTIME_CONFIG = {
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (attempts: number) => [1000, 2000, 4000, 8000, 16000][Math.min(attempts, 4)],
    timeout: 10000,
    enablePresence: false,
};

export const CHANNEL_NAMES = {
    CIVILIAN_FLIGHTS: 'flights:civilian',
    MILITARY_FLIGHTS: 'flights:military',
    CCTV: 'cctv',
};

export const EVENT_NAMES = {
    UPDATE: 'update',
    HEARTBEAT: 'heartbeat',
};
