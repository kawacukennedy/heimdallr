'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    width?: string;
}

export default function Select({ label, value, options, onChange, width = '100%' }: SelectProps) {
    return (
        <div className="space-y-1.5">
            {label && <label className="text-xs text-white/60">{label}</label>}
            <div className="relative" style={{ width }}>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none glass-input pr-8 text-sm cursor-pointer"
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                />
            </div>
        </div>
    );
}
