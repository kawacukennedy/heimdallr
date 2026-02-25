'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GlassPanel from './GlassPanel';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    width = '560px',
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Trap focus
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-modal flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal content */}
                    <motion.div
                        ref={modalRef}
                        tabIndex={-1}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{ width, maxWidth: '90vw', maxHeight: '80vh' }}
                    >
                        <GlassPanel elevation="high" rounded="lg" className="overflow-hidden">
                            {/* Header */}
                            {title && (
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                    <h2 className="text-headline text-white font-semibold">{title}</h2>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                                        aria-label="Close"
                                    >
                                        <X size={18} className="text-white/60" />
                                    </button>
                                </div>
                            )}

                            {/* Body */}
                            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
                                {children}
                            </div>
                        </GlassPanel>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
