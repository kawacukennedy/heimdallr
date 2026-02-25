// Error utilities
export class AppError extends Error { constructor(message: string, public code: string, public statusCode = 500) { super(message); this.name = 'AppError'; } }
export class NetworkError extends AppError { constructor(message = 'Network request failed') { super(message, 'NETWORK_ERROR', 0); } }
export class TimeoutError extends AppError { constructor(message = 'Request timed out') { super(message, 'TIMEOUT_ERROR', 408); } }
export class NotFoundError extends AppError { constructor(message = 'Resource not found') { super(message, 'NOT_FOUND', 404); } }

export function isNetworkError(err: unknown): err is NetworkError { return err instanceof NetworkError; }
export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'Unknown error';
}
