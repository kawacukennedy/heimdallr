'use client';

import React from 'react';
import Modal from './Modal';
import { useUIStore } from '@/store/uiStore';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants/keyboardShortcuts';

export default function KeyboardShortcutsHelp() {
    const helpOpen = useUIStore((s) => s.helpOpen);
    const setHelpOpen = useUIStore((s) => s.setHelpOpen);

    // Group shortcuts by category
    const grouped = KEYBOARD_SHORTCUTS.reduce(
        (acc, s) => {
            if (!acc[s.category]) acc[s.category] = [];
            acc[s.category].push(s);
            return acc;
        },
        {} as Record<string, typeof KEYBOARD_SHORTCUTS[number][]>
    );

    return (
        <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Keyboard Shortcuts" width="480px">
            <div className="p-6 space-y-6">
                {Object.entries(grouped).map(([category, shortcuts]) => (
                    <div key={category}>
                        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                            {category}
                        </h3>
                        <div className="space-y-1">
                            {shortcuts.map((shortcut) => (
                                <div
                                    key={shortcut.key}
                                    className="flex items-center justify-between py-2 border-b border-white/5"
                                >
                                    <span className="text-sm text-white/70">{shortcut.action}</span>
                                    <kbd className="px-2.5 py-1 bg-white/8 border border-white/15 rounded text-xs text-accent font-mono min-w-[32px] text-center">
                                        {shortcut.key}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
