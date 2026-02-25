'use client';

import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    fullScreen?: boolean;
}

const sizeMap = { sm: 16, md: 24, lg: 40 };

export default function LoadingSpinner({ size = 'md', label, fullScreen }: LoadingSpinnerProps) {
    const dim = sizeMap[size];

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <svg
                width={dim}
                height={dim}
                viewBox="0 0 24 24"
                fill="none"
                className="animate-spin"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="3"
                />
                <path
                    d="M12 2C6.48 2 2 6.48 2 12"
                    stroke="#0a84ff"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
            {label && <span className="text-xs text-white/50">{label}</span>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
}
