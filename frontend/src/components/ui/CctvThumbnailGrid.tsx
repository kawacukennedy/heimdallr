'use client';

import React from 'react';
import { Camera, Loader2 } from 'lucide-react';
import GlassPanel from './GlassPanel';
import type { CCTVCamera } from '@/types';

interface CctvThumbnailGridProps {
    cameras: CCTVCamera[];
    loading?: boolean;
    onSelect?: (camera: CCTVCamera) => void;
    selectedId?: string | null;
    proxyBaseUrl?: string;
}

export default function CctvThumbnailGrid({
    cameras,
    loading,
    onSelect,
    selectedId,
    proxyBaseUrl = '',
}: CctvThumbnailGridProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-accent" size={24} />
                <span className="text-xs text-white/50 ml-2">Loading CCTV feeds...</span>
            </div>
        );
    }

    if (cameras.length === 0) {
        return (
            <div className="text-center py-8 text-white/30">
                <Camera size={32} className="mx-auto mb-2" />
                <p className="text-xs">No CCTV cameras available</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            {cameras.map((cam) => {
                const isSelected = cam.id === selectedId;
                return (
                    <button
                        key={cam.id}
                        onClick={() => onSelect?.(cam)}
                        className={`group relative aspect-video rounded-lg overflow-hidden border transition-all ${isSelected
                                ? 'border-accent ring-2 ring-accent/30'
                                : 'border-white/10 hover:border-white/25'
                            }`}
                    >
                        {/* Placeholder – actual image loads from proxy */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Camera size={20} className="text-white/20" />
                            </div>
                        </div>

                        {/* Label */}
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1">
                            <p className="text-[10px] text-white/80 truncate font-medium">
                                {cam.label || cam.city || cam.id}
                            </p>
                        </div>

                        {/* Live indicator */}
                        <div className="absolute top-1 right-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                            <span className="text-[8px] text-white/60 uppercase tracking-wider">Live</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
