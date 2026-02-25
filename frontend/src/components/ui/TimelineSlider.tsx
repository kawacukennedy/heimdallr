'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Clock } from 'lucide-react';
import GlassPanel from './GlassPanel';

interface TimelineSliderProps {
    startTime?: Date;
    endTime?: Date;
    currentTime?: Date;
    onTimeChange?: (time: Date) => void;
    playing?: boolean;
    onPlayPause?: () => void;
    speed?: number;
    onSpeedChange?: (speed: number) => void;
}

export default function TimelineSlider({
    startTime = new Date(Date.now() - 3600000),
    endTime = new Date(),
    currentTime = new Date(),
    onTimeChange,
    playing = false,
    onPlayPause,
    speed = 1,
    onSpeedChange,
}: TimelineSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);

    const totalRange = endTime.getTime() - startTime.getTime();
    const currentOffset = currentTime.getTime() - startTime.getTime();
    const progress = Math.max(0, Math.min(1, currentOffset / totalRange));

    const handleTrackClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const newTime = new Date(startTime.getTime() + totalRange * x);
            onTimeChange?.(newTime);
        },
        [startTime, totalRange, onTimeChange]
    );

    const formatTime = (date: Date) =>
        date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const SPEEDS = [0.5, 1, 2, 5, 10, 60];

    return (
        <GlassPanel elevation="low" className="px-4 py-2">
            <div className="flex items-center gap-3">
                {/* Play controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            const newTime = new Date(currentTime.getTime() - 60000);
                            onTimeChange?.(newTime);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Rewind 1 minute"
                    >
                        <SkipBack size={14} className="text-white/60" />
                    </button>

                    <button
                        onClick={onPlayPause}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        aria-label={playing ? 'Pause' : 'Play'}
                    >
                        {playing ? (
                            <Pause size={16} className="text-accent" />
                        ) : (
                            <Play size={16} className="text-white/70" />
                        )}
                    </button>

                    <button
                        onClick={() => {
                            const newTime = new Date(currentTime.getTime() + 60000);
                            onTimeChange?.(newTime);
                        }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Forward 1 minute"
                    >
                        <SkipForward size={14} className="text-white/60" />
                    </button>
                </div>

                {/* Start time */}
                <span className="text-[10px] text-white/40 font-mono w-16">{formatTime(startTime)}</span>

                {/* Track */}
                <div
                    ref={trackRef}
                    onClick={handleTrackClick}
                    className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative group"
                >
                    <div
                        className="absolute inset-y-0 left-0 bg-accent/60 rounded-full"
                        style={{ width: `${progress * 100}%` }}
                    />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full shadow-glow opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ left: `calc(${progress * 100}% - 6px)` }}
                    />
                </div>

                {/* End time */}
                <span className="text-[10px] text-white/40 font-mono w-16 text-right">{formatTime(endTime)}</span>

                {/* Speed */}
                <button
                    onClick={() => {
                        const idx = SPEEDS.indexOf(speed);
                        const next = SPEEDS[(idx + 1) % SPEEDS.length];
                        onSpeedChange?.(next);
                    }}
                    className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60 font-mono hover:bg-white/10 transition-colors"
                    title="Playback speed"
                >
                    {speed}×
                </button>

                {/* Current time display */}
                <div className="flex items-center gap-1">
                    <Clock size={12} className="text-white/40" />
                    <span className="text-xs text-white/70 font-mono">{formatTime(currentTime)}</span>
                </div>
            </div>
        </GlassPanel>
    );
}
