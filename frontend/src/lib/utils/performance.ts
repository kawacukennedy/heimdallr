// Performance utilities
export function measureTime<T>(label: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const elapsed = performance.now() - start;
    if (elapsed > 16) console.warn(`[Perf] ${label}: ${elapsed.toFixed(2)}ms (exceeds frame budget)`);
    return result;
}
export async function measureTimeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const elapsed = performance.now() - start;
    if (elapsed > 100) console.warn(`[Perf] ${label}: ${elapsed.toFixed(2)}ms`);
    return result;
}
export function createFPSCounter() {
    let frames = 0, lastTime = performance.now(), fps = 0;
    return { tick: () => { frames++; const now = performance.now(); if (now - lastTime >= 1000) { fps = frames; frames = 0; lastTime = now; } return fps; }, get fps() { return fps; } };
}
export function throttle<T extends (...args: any[]) => any>(fn: T, ms: number): T {
    let last = 0;
    return ((...args: any[]) => { const now = Date.now(); if (now - last >= ms) { last = now; return fn(...args); } }) as T;
}
