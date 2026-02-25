// Number utilities
export function formatCompact(n: number): string { if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`; if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`; return n.toString(); }
export function percentage(part: number, total: number, decimals = 1): string { return total === 0 ? '0%' : `${((part / total) * 100).toFixed(decimals)}%`; }
export function padZero(n: number, width = 2): string { return n.toString().padStart(width, '0'); }
export function isFiniteNumber(val: unknown): val is number { return typeof val === 'number' && Number.isFinite(val); }
export function sum(arr: number[]): number { return arr.reduce((a, b) => a + b, 0); }
export function avg(arr: number[]): number { return arr.length === 0 ? 0 : sum(arr) / arr.length; }
