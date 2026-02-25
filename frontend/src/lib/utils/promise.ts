// Promise utilities
export function delay(ms: number): Promise<void> { return new Promise(resolve => setTimeout(resolve, ms)); }
export async function timeout<T>(promise: Promise<T>, ms: number, message = 'Timed out'): Promise<T> {
    return Promise.race([promise, delay(ms).then(() => { throw new Error(message); })]);
}
export async function allSettled<T>(promises: Promise<T>[]): Promise<{ status: 'fulfilled' | 'rejected'; value?: T; reason?: any }[]> {
    return Promise.allSettled(promises);
}
export function createDeferred<T>() {
    let resolve!: (v: T) => void, reject!: (e: any) => void;
    const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
}
