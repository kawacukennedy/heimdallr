'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LayerToggleProps {
    label: string;
    icon: LucideIcon;
    checked: boolean;
    onChange: () => void;
    count?: number;
}

export default function LayerToggle({ label, icon: Icon, checked, onChange, count }: LayerToggleProps) {
    return (
        <label className="flex items-center gap-3 px-3 py-2 rounded-card cursor-pointer hover:bg-white/5 transition-colors group">
            <Icon size={16} className={checked ? 'text-accent' : 'text-white/40'} />
            <span className={`flex-1 text-sm ${checked ? 'text-white' : 'text-white/50'}`}>{label}</span>
            {count !== undefined && (
                <span className="text-[10px] text-white/40 font-mono mr-2">{count}</span>
            )}
            <div className="relative">
                <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
                <div className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-white/15'}`}>
                    <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'
                            }`}
                    />
                </div>
            </div>
        </label>
    );
}
