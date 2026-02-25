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

const blurMap = { low: '10px', medium: '20px', high: '30px' };
const shadowMap = {
    low: '0 2px 8px rgba(0,0,0,0.3)',
    medium: '0 10px 30px -10px rgba(0,0,0,0.5)',
    high: '0 20px 40px -10px rgba(0,0,0,0.7)',
};
const roundedMap = { sm: '8px', panel: '12px', lg: '16px', xl: '20px' };

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
            className={`border border-white/10 ${className}`}
            style={{
                background: 'rgba(30, 30, 40, 0.8)',
                backdropFilter: `blur(${blurMap[elevation]})`,
                WebkitBackdropFilter: `blur(${blurMap[elevation]})`,
                boxShadow: shadowMap[elevation],
                borderRadius: roundedMap[rounded],
                ...style,
            }}
        >
            {children}
        </div>
    );
}
