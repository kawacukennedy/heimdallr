'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastContext, ToastVariant } from '@/providers/ToastProvider';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const variantStyles: Record<ToastVariant, { icon: React.ElementType; bg: string; border: string }> = {
    info: { icon: Info, bg: 'bg-accent/20', border: 'border-accent/40' },
    success: { icon: CheckCircle, bg: 'bg-success/20', border: 'border-success/40' },
    warning: { icon: AlertTriangle, bg: 'bg-warning/20', border: 'border-warning/40' },
    error: { icon: AlertCircle, bg: 'bg-danger/20', border: 'border-danger/40' },
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToastContext();

    return (
        <div className="fixed bottom-6 right-6 z-tooltip flex flex-col gap-2" style={{ maxWidth: '380px' }}>
            <AnimatePresence>
                {toasts.map((toast) => {
                    const { icon: Icon, bg, border } = variantStyles[toast.variant];
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={`flex items-start gap-3 px-4 py-3 rounded-card border ${bg} ${border} backdrop-blur-panel`}
                            style={{ background: 'rgba(30, 30, 40, 0.9)', backdropFilter: 'blur(20px)' }}
                        >
                            <Icon size={18} className="mt-0.5 shrink-0" />
                            <p className="text-sm text-white/90 flex-1">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-0.5 hover:bg-white/10 rounded-full shrink-0"
                            >
                                <X size={14} className="text-white/50" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
