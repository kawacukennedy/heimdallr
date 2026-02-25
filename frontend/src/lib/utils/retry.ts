// Retry with exponential backoff
import { delay } from './promise';

interface RetryOptions { maxRetries?: number; baseDelay?: number; maxDelay?: number; onRetry?: (attempt: number, error: any) => void; }

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, onRetry } = options;
    let lastError: any;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try { return await fn(); }
        catch (err) {
            lastError = err;
            if (attempt < maxRetries) {
                const d = Math.min(baseDelay * 2 ** attempt + Math.random() * 100, maxDelay);
                onRetry?.(attempt + 1, err);
                await delay(d);
            }
        }
    }
    throw lastError;
}
