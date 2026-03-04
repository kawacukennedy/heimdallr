'use client';

import React from 'react';

interface GlassPanelProps {
    children: React.ReactNode;
    elevation?: 'low' | 'medium' | 'high';
    rounded?: 'sm' | 'panel' | 'lg' | 'xl';
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const blurMap = { low: '8px', medium: '12px', high: '20px' };
const shadowMap = {
    low: '0 0 1px rgba(0,229,255,0.08), 0 2px 10px -4px rgba(0,0,0,0.6)',
    medium: '0 0 1px rgba(0,229,255,0.12), 0 4px 20px -6px rgba(0,0,0,0.7)',
    high: '0 0 2px rgba(0,229,255,0.15), 0 10px 30px -8px rgba(0,0,0,0.85)',
};

export default function GlassPanel({
    children,
    elevation = 'medium',
    rounded = 'panel',
    className = '',
    style,
    onClick,
}: GlassPanelProps) {
    return (
        <div
            onClick={onClick}
            className={`border border-white/[0.06] ${className}`}
            style={{
                background: 'rgba(8, 12, 18, 0.92)',
                backdropFilter: `blur(${blurMap[elevation]})`,
                WebkitBackdropFilter: `blur(${blurMap[elevation]})`,
                boxShadow: shadowMap[elevation],
                borderRadius: '2px',
                borderColor: 'rgba(60, 80, 100, 0.35)',
                ...style,
            }}
        >
            {children}
        </div>
    );
}
