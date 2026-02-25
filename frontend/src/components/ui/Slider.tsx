'use client';

import React from 'react';

interface SliderProps {
    label?: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    unit?: string;
    formatValue?: (value: number) => string;
}

export default function Slider({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    unit,
    formatValue,
}: SliderProps) {
    const displayValue = formatValue ? formatValue(value) : value.toString();
    const progress = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-1.5">
            {label && (
                <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">{label}</span>
                    <span className="text-xs text-white/80 font-mono">
                        {displayValue}{unit && <span className="text-white/40 ml-0.5">{unit}</span>}
                    </span>
                </div>
            )}
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer outline-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3.5
            [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:shadow-glow
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-accent/50"
                    style={{
                        background: `linear-gradient(to right, rgba(10,132,255,0.5) 0%, rgba(10,132,255,0.5) ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
                    }}
                />
            </div>
        </div>
    );
}
