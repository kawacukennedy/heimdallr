// Client-side logger
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
const LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };
let currentLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean { return LEVELS[level] >= LEVELS[currentLevel]; }

export const logger = {
    setLevel: (level: LogLevel) => { currentLevel = level; },
    debug: (...args: any[]) => shouldLog('debug') && console.debug('[Heimdallr]', ...args),
    info: (...args: any[]) => shouldLog('info') && console.info('[Heimdallr]', ...args),
    warn: (...args: any[]) => shouldLog('warn') && console.warn('[Heimdallr]', ...args),
    error: (...args: any[]) => shouldLog('error') && console.error('[Heimdallr]', ...args),
};
