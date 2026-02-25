// Array utilities
export function chunk<T>(arr: T[], size: number): T[][] { const out: T[][] = []; for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size)); return out; }
export function unique<T>(arr: T[]): T[] { return [...new Set(arr)]; }
export function uniqueBy<T>(arr: T[], key: (item: T) => string): T[] { const seen = new Set<string>(); return arr.filter(item => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true; }); }
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> { return arr.reduce((acc, item) => { const k = key(item); (acc[k] ??= []).push(item); return acc; }, {} as Record<string, T[]>); }
export function sortBy<T>(arr: T[], key: (item: T) => number | string, desc = false): T[] { return [...arr].sort((a, b) => { const va = key(a), vb = key(b); const cmp = va < vb ? -1 : va > vb ? 1 : 0; return desc ? -cmp : cmp; }); }
export function last<T>(arr: T[]): T | undefined { return arr[arr.length - 1]; }
export function compact<T>(arr: (T | null | undefined | false)[]): T[] { return arr.filter(Boolean) as T[]; }
