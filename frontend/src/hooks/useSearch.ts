'use client';

import { useState, useCallback, useRef } from 'react';
import Fuse from 'fuse.js';
import { API_ENDPOINTS } from '@/lib/constants/apiEndpoints';
import type { SearchResult } from '@/types';

export function useSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout>();

    const searchLocations = useCallback(async (q: string): Promise<SearchResult[]> => {
        try {
            const res = await fetch(API_ENDPOINTS.NOMINATIM(q));
            const data = await res.json();
            return data.map((item: any) => ({
                id: `loc-${item.place_id}`,
                name: item.display_name,
                category: 'location' as const,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
            }));
        } catch {
            return [];
        }
    }, []);

    const searchEntities = useCallback(
        (q: string, entities: { id: string; name: string; category: string; lat: number; lon: number }[]): SearchResult[] => {
            const fuse = new Fuse(entities, {
                keys: ['name', 'id'],
                threshold: 0.4,
            });
            return fuse.search(q).map((r) => r.item as SearchResult).slice(0, 5);
        },
        []
    );

    const search = useCallback(
        async (q: string) => {
            if (q.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const locations = await searchLocations(q);
                setResults(locations.slice(0, 8));
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        },
        [searchLocations]
    );

    const debouncedSearch = useCallback(
        (q: string) => {
            setQuery(q);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => search(q), 300);
        },
        [search]
    );

    const clear = useCallback(() => {
        setQuery('');
        setResults([]);
    }, []);

    return {
        query,
        results,
        loading,
        search: debouncedSearch,
        clear,
        searchLocations,
        searchEntities,
    };
}
