'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';

interface AddBookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddBookmarkModal({ isOpen, onClose }: AddBookmarkModalProps) {
    const { viewerRef } = useCesiumContext();
    const addBookmark = useUIStore((s) => s.addBookmark);
    const [name, setName] = useState('');

    const handleSave = async () => {
        if (!name.trim()) return;

        const viewer = viewerRef.current;
        if (!viewer) return;

        const Cesium = await import('cesium');
        const carto = viewer.camera.positionCartographic;

        addBookmark({
            name: name.trim(),
            camera: {
                longitude: Cesium.Math.toDegrees(carto.longitude),
                latitude: Cesium.Math.toDegrees(carto.latitude),
                height: carto.height,
                heading: Cesium.Math.toDegrees(viewer.camera.heading),
                pitch: Cesium.Math.toDegrees(viewer.camera.pitch),
                roll: Cesium.Math.toDegrees(viewer.camera.roll),
            },
        });

        setName('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Bookmark" width="400px">
            <div className="p-6 space-y-4">
                <p className="text-xs text-white/50">
                    Save the current camera position as a bookmark for quick navigation.
                </p>
                <div>
                    <label className="block text-xs text-white/60 mb-1.5">Bookmark Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Downtown NYC"
                        className="glass-input w-full"
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        autoFocus
                    />
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-button text-sm text-white/60 hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="px-4 py-2 bg-accent/15 border border-accent/30 rounded-button text-accent text-sm hover:bg-accent/25 transition-colors disabled:opacity-40"
                    >
                        Save Bookmark
                    </button>
                </div>
            </div>
        </Modal>
    );
}
