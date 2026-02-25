'use client';

import React, { useEffect, useRef } from 'react';

interface ScreenReaderOnlyProps {
    children: React.ReactNode;
}

// Visually hidden but available to screen readers
export function ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
    return (
        <span
            className="absolute overflow-hidden whitespace-nowrap border-0"
            style={{
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                clip: 'rect(0,0,0,0)',
            }}
        >
            {children}
        </span>
    );
}

// Announce dynamic content changes to screen readers
export function LiveRegion({
    message,
    politeness = 'polite',
}: {
    message: string;
    politeness?: 'polite' | 'assertive';
}) {
    return (
        <div
            aria-live={politeness}
            aria-atomic="true"
            role="status"
            className="sr-only"
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
            }}
        >
            {message}
        </div>
    );
}

// Skip-to-content link for keyboard users
export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
    return (
        <a
            href={`#${targetId}`}
            className="fixed top-0 left-0 -translate-y-full focus:translate-y-0 bg-accent text-white px-4 py-2 z-[9999] text-sm transition-transform"
        >
            Skip to main content
        </a>
    );
}

// Focus trap for modals
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active: boolean) {
    useEffect(() => {
        if (!active || !containerRef.current) return;

        const container = containerRef.current;
        const focusable = container.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl?.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl?.focus();
                }
            }
        };

        container.addEventListener('keydown', handler);
        firstEl?.focus();

        return () => container.removeEventListener('keydown', handler);
    }, [active, containerRef]);
}
