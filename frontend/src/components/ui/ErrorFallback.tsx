'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import GlassPanel from './GlassPanel';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary?: () => void;
    title?: string;
}

export default function ErrorFallback({
    error,
    resetErrorBoundary,
    title = 'Something went wrong',
}: ErrorFallbackProps) {
    return (
        <div className="flex items-center justify-center p-8">
            <GlassPanel elevation="medium" className="p-6 max-w-sm text-center">
                <AlertTriangle size={32} className="text-danger mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-white/50 mb-4">{error.message}</p>
                {resetErrorBoundary && (
                    <button
                        onClick={resetErrorBoundary}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 border border-accent/30 rounded-button text-accent text-sm hover:bg-accent/25 transition-colors"
                    >
                        <RefreshCw size={14} /> Try Again
                    </button>
                )}
            </GlassPanel>
        </div>
    );
}
