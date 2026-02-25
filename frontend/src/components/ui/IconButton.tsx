'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
    icon: LucideIcon;
    onClick?: () => void;
    size?: number;
    variant?: 'ghost' | 'outline' | 'accent';
    tooltip?: string;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    'aria-label'?: string;
}

export default function IconButton({
    icon: Icon,
    onClick,
    size = 18,
    variant = 'ghost',
    tooltip,
    className = '',
    disabled = false,
    children,
    'aria-label': ariaLabel,
}: IconButtonProps) {
    const baseClasses = 'flex items-center justify-center gap-2 transition-all duration-200 rounded-button cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

    const variantClasses = {
        ghost: 'p-2 hover:bg-white/10 active:scale-95',
        outline: 'px-3 py-2 border border-white/15 hover:bg-white/10 hover:border-white/25 active:scale-95',
        accent: 'px-3 py-2 bg-accent/15 border border-accent/30 hover:bg-accent/25 hover:border-accent/50 active:scale-95',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
            aria-label={ariaLabel || tooltip}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            <Icon size={size} className="text-white/80" />
            {children && <span className="text-sm text-white/80">{children}</span>}
        </button>
    );
}
