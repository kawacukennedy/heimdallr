'use client';

import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export default function Tooltip({
    content,
    children,
    position = 'top',
    delay = 300,
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const show = () => {
        const id = setTimeout(() => setVisible(true), delay);
        setTimeoutId(id);
    };

    const hide = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setVisible(false);
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}
            {visible && (
                <div
                    className={`absolute z-tooltip ${positionClasses[position]} pointer-events-none`}
                    role="tooltip"
                >
                    <div className="px-2.5 py-1.5 bg-black/90 border border-white/15 rounded-md text-xs text-white/80 whitespace-nowrap backdrop-blur-sm">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
}
