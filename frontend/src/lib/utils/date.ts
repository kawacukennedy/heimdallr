// Date utilities
export function toUTC(date: Date): string { return date.toISOString(); }
export function fromUTC(iso: string): Date { return new Date(iso); }
export function isToday(date: Date): boolean { const t = new Date(); return date.toDateString() === t.toDateString(); }
export function isYesterday(date: Date): boolean { const y = new Date(); y.setDate(y.getDate() - 1); return date.toDateString() === y.toDateString(); }
export function daysBetween(a: Date, b: Date): number { return Math.floor(Math.abs(a.getTime() - b.getTime()) / 86400000); }
export function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ${s % 60}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
}
export function getTimeZoneOffset(): string {
    const offset = new Date().getTimezoneOffset();
    const sign = offset <= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
    const mins = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `UTC${sign}${hours}:${mins}`;
}
