'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    disabled?: boolean;
}

export default function Checkbox({ label, checked, onChange, description, disabled }: CheckboxProps) {
    return (
        <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="relative mt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={`w-4.5 h-4.5 rounded border transition-colors flex items-center justify-center ${checked
                            ? 'bg-accent border-accent'
                            : 'bg-white/5 border-white/20 hover:border-white/40'
                        }`}
                    style={{ width: 18, height: 18 }}
                >
                    {checked && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
            </div>
            <div>
                <span className="text-sm text-white/80">{label}</span>
                {description && <p className="text-[10px] text-white/40 mt-0.5">{description}</p>}
            </div>
        </label>
    );
}
