'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Plane, Satellite, X, Loader2 } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { useUIStore } from '@/store/uiStore';
import { API_ENDPOINTS } from '@/lib/constants/apiEndpoints';
import type { SearchResult } from '@/types';

export default function SearchOverlay() {
    const searchOpen = useUIStore((s) => s.searchOpen);
    const setSearchOpen = useUIStore((s) => s.setSearchOpen);
    const selectEntity = useUIStore((s) => s.selectEntity);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!searchOpen) {
            setQuery('');
            setResults([]);
        }
    }, [searchOpen]);

    const doSearch = useCallback(async (q: string) => {
        if (q.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            // Geocoding search
            const geoRes = await fetch(API_ENDPOINTS.NOMINATIM(q));
            const geoData = await geoRes.json();

            const locationResults: SearchResult[] = geoData.map((item: any) => ({
                id: `loc-${item.place_id}`,
                name: item.display_name,
                category: 'location' as const,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
            }));

            setResults(locationResults.slice(0, 8));
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 300);
    };

    const handleSelect = (result: SearchResult) => {
        selectEntity(result.id, result.category === 'location' ? null : result.category);
        setSearchOpen(false);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'location': return MapPin;
            case 'flight': return Plane;
            case 'satellite': return Satellite;
            default: return MapPin;
        }
    };

    return (
        <AnimatePresence>
            {searchOpen && (
                <motion.div
                    className="fixed inset-0 z-modal flex items-start justify-center pt-[15vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />

                    <motion.div
                        className="relative w-full max-w-lg mx-4"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <GlassPanel elevation="high" rounded="lg" className="overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                                <Search size={18} className="text-white/40 shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={handleChange}
                                    placeholder="Search locations, flights, satellites..."
                                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-sm"
                                />
                                {loading && <Loader2 size={16} className="text-accent animate-spin" />}
                                {query && (
                                    <button onClick={() => { setQuery(''); setResults([]); }} className="p-1 hover:bg-white/10 rounded-full">
                                        <X size={14} className="text-white/50" />
                                    </button>
                                )}
                            </div>

                            {/* Results */}
                            {results.length > 0 && (
                                <div className="max-h-[50vh] overflow-y-auto">
                                    {results.map((result) => {
                                        const Icon = getCategoryIcon(result.category);
                                        return (
                                            <button
                                                key={result.id}
                                                onClick={() => handleSelect(result)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/8 transition-colors text-left border-b border-white/5 last:border-b-0"
                                            >
                                                <Icon size={16} className="text-white/40 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white/90 truncate">{result.name}</p>
                                                    <p className="text-xs text-white/40 capitalize">{result.category}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Empty state */}
                            {query.length >= 2 && !loading && results.length === 0 && (
                                <div className="py-8 text-center text-white/30 text-sm">
                                    No results found for &ldquo;{query}&rdquo;
                                </div>
                            )}

                            {/* Keyboard hint */}
                            <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4">
                                <span className="text-xs text-white/30">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↵</kbd> Select
                                </span>
                                <span className="text-xs text-white/30">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">Esc</kbd> Close
                                </span>
                            </div>
                        </GlassPanel>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
