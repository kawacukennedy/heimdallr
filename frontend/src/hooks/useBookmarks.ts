'use client';

import { useUIStore } from '@/store/uiStore';
import { useCamera } from '@/hooks/useCamera';
import type { Bookmark, CameraPosition } from '@/types';

export function useBookmarks() {
    const bookmarks = useUIStore((s) => s.bookmarks);
    const addBookmark = useUIStore((s) => s.addBookmark);
    const removeBookmark = useUIStore((s) => s.removeBookmark);
    const { flyToBookmark, getCameraPosition } = useCamera();

    const saveCurrentPosition = (name: string) => {
        const position = getCameraPosition();
        if (position) {
            addBookmark({ name, camera: position });
        }
    };

    const navigateTo = (name: string) => {
        const bookmark = bookmarks.find((b) => b.name === name);
        if (bookmark) {
            flyToBookmark(bookmark);
        }
    };

    const exists = (name: string): boolean => {
        return bookmarks.some((b) => b.name === name);
    };

    return {
        bookmarks,
        addBookmark,
        removeBookmark,
        saveCurrentPosition,
        navigateTo,
        exists,
    };
}
