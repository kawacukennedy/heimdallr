'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Clock, X } from 'lucide-react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';
import GlassPanel from '../ui/GlassPanel';

export default function TimelinePlayback() {
    const { viewerRef } = useCesiumContext();
    const playbackMode = useUIStore((s: any) => s.playbackMode);
    const setPlaybackMode = useUIStore((s: any) => s.setPlaybackMode);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState({ start: '', end: '' });
    const [entityCount, setEntityCount] = useState(0);
    const [availableRange, setAvailableRange] = useState<{
        earliest: string | null;
        latest: string | null;
        totalRecords: number;
    }>({ earliest: null, latest: null, totalRecords: 0 });
    const czmlDataSourceRef = useRef<any>(null);

    useEffect(() => {
        const checkAvailability = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const res = await fetch(`${backendUrl}/api/czml/available`);
                if (res.ok) {
                    const data = await res.json();
                    setAvailableRange(data);
                    if (data.earliest && data.latest) {
                        setTimeRange({ start: data.earliest, end: data.latest });
                    }
                }
            } catch (err) { /* silent */ }
        };
        if (playbackMode) checkAvailability();
    }, [playbackMode]);

    const loadCzml = useCallback(async () => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        setLoading(true);
        setError(null);

        try {
            const Cesium = await import('cesium');
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const url = `${backendUrl}/api/czml?start=${encodeURIComponent(timeRange.start)}&end=${encodeURIComponent(timeRange.end)}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error(`CZML FETCH FAILED: ${res.status}`);

            const czmlData = await res.json();
            if (!czmlData || czmlData.length <= 1) {
                setError('NO HISTORICAL DATA FOR RANGE');
                setLoading(false);
                return;
            }

            if (czmlDataSourceRef.current) {
                viewer.dataSources.remove(czmlDataSourceRef.current, true);
            }

            const dataSource = await Cesium.CzmlDataSource.load(czmlData);
            czmlDataSourceRef.current = dataSource;
            viewer.dataSources.add(dataSource);
            setEntityCount(czmlData.length - 1);

            if (dataSource.clock) {
                viewer.clock.startTime = dataSource.clock.startTime;
                viewer.clock.stopTime = dataSource.clock.stopTime;
                viewer.clock.currentTime = dataSource.clock.startTime.clone();
                viewer.clock.multiplier = 60;
                viewer.clock.shouldAnimate = true;
                viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
            }

            setIsPlaying(true);
            viewer.scene.requestRender();
        } catch (err: any) {
            setError(err.message || 'CZML LOAD FAILURE');
        } finally {
            setLoading(false);
        }
    }, [viewerRef, timeRange]);

    const togglePlayPause = useCallback(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate;
        setIsPlaying(viewer.clock.shouldAnimate);
    }, [viewerRef]);

    const setSpeed = useCallback((multiplier: number) => {
        const viewer = viewerRef.current;
        if (viewer) viewer.clock.multiplier = multiplier;
    }, [viewerRef]);

    const exitPlayback = useCallback(() => {
        const viewer = viewerRef.current;
        if (viewer && czmlDataSourceRef.current) {
            viewer.dataSources.remove(czmlDataSourceRef.current, true);
            czmlDataSourceRef.current = null;
            viewer.clock.shouldAnimate = true;
            viewer.clock.multiplier = 1;
        }
        setIsPlaying(false);
        setEntityCount(0);
        setPlaybackMode(false);
    }, [viewerRef, setPlaybackMode]);

    if (!playbackMode) return null;

    return (
        <motion.div
            className="fixed bottom-[196px] left-1/2 -translate-x-1/2 z-40"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
            <GlassPanel elevation="high" className="px-3 py-2 flex items-center gap-3 min-w-[420px]">
                <button
                    onClick={exitPlayback}
                    className="p-0.5 hover:bg-white/[0.06] rounded-sm transition-colors"
                    title="Exit Playback"
                >
                    <X size={12} className="text-white/30" />
                </button>

                <div className="flex items-center gap-1.5">
                    <Clock size={10} className="text-cyan-400/60" />
                    <span className="text-[8px] font-mono font-bold text-cyan-300 uppercase tracking-[0.15em]">4D PLAYBACK</span>
                </div>

                <span className="tac-divider" />

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setSpeed(1)}
                        className="p-1 hover:bg-white/[0.06] rounded-sm transition-colors"
                        title="1x"
                    >
                        <SkipBack size={10} className="text-white/40" />
                    </button>

                    <button
                        onClick={czmlDataSourceRef.current ? togglePlayPause : loadCzml}
                        disabled={loading}
                        className={`p-1.5 rounded-sm transition-colors ${loading ? 'bg-white/[0.03] cursor-wait' : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20'
                            }`}
                        title={czmlDataSourceRef.current ? (isPlaying ? 'Pause' : 'Play') : 'Load & Play'}
                    >
                        {loading ? (
                            <div className="w-3 h-3 border border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={12} className="text-cyan-300" />
                        ) : (
                            <Play size={12} className="text-cyan-300 ml-px" />
                        )}
                    </button>

                    <button
                        onClick={() => setSpeed(120)}
                        className="p-1 hover:bg-white/[0.06] rounded-sm transition-colors"
                        title="120x"
                    >
                        <SkipForward size={10} className="text-white/40" />
                    </button>
                </div>

                <span className="tac-divider" />

                <div className="text-right">
                    {error ? (
                        <span className="text-[8px] font-mono text-red-400/70">{error}</span>
                    ) : entityCount > 0 ? (
                        <span className="text-[8px] font-mono text-white/35">{entityCount} ENTITIES</span>
                    ) : availableRange.totalRecords > 0 ? (
                        <span className="text-[8px] font-mono text-white/35">{availableRange.totalRecords} RECORDS</span>
                    ) : (
                        <span className="text-[8px] font-mono text-white/20">NO HISTORICAL DATA</span>
                    )}
                </div>

                <div className="flex gap-0.5">
                    {[1, 10, 60, 120].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => setSpeed(speed)}
                            className="text-[7px] font-mono px-1.5 py-0.5 bg-white/[0.03] hover:bg-white/[0.08] text-white/35 transition-colors border border-white/[0.06]"
                        >
                            {speed}X
                        </button>
                    ))}
                </div>
            </GlassPanel>
        </motion.div>
    );
}
