'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ShaderSelectorProps {
    label: string;
    icon: LucideIcon;
    value: string;
    selected: boolean;
    onClick: () => void;
    description?: string;
}

export default function ShaderSelector({ label, icon: Icon, value, selected, onClick, description }: ShaderSelectorProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-card text-left transition-all ${selected
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'hover:bg-white/5 text-white/60 border border-transparent'
                }`}
            aria-pressed={selected}
        >
            <Icon size={16} className={selected ? 'text-accent' : 'text-white/40'} />
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{label}</div>
                {description && <div className="text-[10px] text-white/40 truncate">{description}</div>}
            </div>
            {selected && <span className="w-2 h-2 rounded-full bg-accent" />}
        </button>
    );
}
