'use client';

import React from 'react';

interface RadioOption {
    label: string;
    value: string;
    description?: string;
}

interface RadioGroupProps {
    label?: string;
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    orientation?: 'vertical' | 'horizontal';
}

export default function RadioGroup({ label, options, value, onChange, orientation = 'vertical' }: RadioGroupProps) {
    return (
        <fieldset className="space-y-2">
            {label && <legend className="text-xs text-white/60 mb-2">{label}</legend>}
            <div className={`flex ${orientation === 'vertical' ? 'flex-col gap-2' : 'gap-4'}`}>
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="radio"
                                name={label || 'radio-group'}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={() => onChange(opt.value)}
                                className="sr-only"
                            />
                            <div
                                className={`w-4 h-4 rounded-full border-2 transition-colors ${value === opt.value
                                        ? 'border-accent'
                                        : 'border-white/25 group-hover:border-white/40'
                                    }`}
                            >
                                {value === opt.value && (
                                    <div className="absolute inset-1 rounded-full bg-accent" />
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-sm text-white/80">{opt.label}</span>
                            {opt.description && <p className="text-[10px] text-white/40">{opt.description}</p>}
                        </div>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
