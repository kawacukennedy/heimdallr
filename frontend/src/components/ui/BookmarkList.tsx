'use client';

import React from 'react';
import { MapPin, X, Globe } from 'lucide-react';
import type { Bookmark } from '@/types';

interface BookmarkListProps {
    bookmarks: Bookmark[];
    onSelect: (bookmark: Bookmark) => void;
    onRemove: (name: string) => void;
}

export default function BookmarkList({ bookmarks, onSelect, onRemove }: BookmarkListProps) {
    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-4 text-white/30 text-xs">
                <Globe size={20} className="mx-auto mb-1.5" />
                No bookmarks saved
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {bookmarks.map((bm) => (
                <div
                    key={bm.name}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-card hover:bg-white/5 group cursor-pointer transition-colors"
                    onClick={() => onSelect(bm)}
                >
                    <MapPin size={14} className="text-accent/70 flex-shrink-0" />
                    <span className="flex-1 text-sm text-white/80 truncate">{bm.name}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(bm.name); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-opacity"
                        aria-label={`Remove ${bm.name}`}
                    >
                        <X size={12} className="text-white/40" />
                    </button>
                </div>
            ))}
        </div>
    );
}
