// In-memory cache with TTL
export class Cache<T> {
    private store = new Map<string, { value: T; expires: number }>();

    constructor(private defaultTTL = 30000) { }

    set(key: string, value: T, ttl = this.defaultTTL): void {
        this.store.set(key, { value, expires: Date.now() + ttl });
    }

    get(key: string): T | undefined {
        const entry = this.store.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expires) { this.store.delete(key); return undefined; }
        return entry.value;
    }

    has(key: string): boolean { return this.get(key) !== undefined; }
    delete(key: string): void { this.store.delete(key); }
    clear(): void { this.store.clear(); }
    size(): number { return this.store.size; }

    prune(): number {
        const now = Date.now();
        let removed = 0;
        this.store.forEach((entry, key) => { if (now > entry.expires) { this.store.delete(key); removed++; } });
        return removed;
    }
}
