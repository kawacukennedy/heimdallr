'use client';

import { useToastContext } from '@/providers/ToastProvider';
import type { ToastVariant } from '@/providers/ToastProvider';

export function useToast() {
    const { addToast, removeToast, toasts } = useToastContext();

    const info = (message: string, duration?: number) => addToast(message, 'info', duration);
    const success = (message: string, duration?: number) => addToast(message, 'success', duration);
    const warning = (message: string, duration?: number) => addToast(message, 'warning', duration);
    const error = (message: string, duration?: number) => addToast(message, 'error', duration);

    return { info, success, warning, error, addToast, removeToast, toasts };
}
