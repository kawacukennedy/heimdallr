'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Satellite, Camera, Anchor, X, MapPin, Navigation, Gauge } from 'lucide-react';
import GlassPanel from './GlassPanel';
import { useUIStore } from '@/store/uiStore';
import { useCesiumContext } from '@/providers/CesiumProvider';

export default function SelectedEntityPanel() {
    const selectedEntityId = useUIStore((s) => s.selectedEntityId);
    const selectedEntityType = useUIStore((s) => s.selectedEntityType);
    const selectEntity = useUIStore((s) => s.selectEntity);
    const { entityStoreRef, viewerRef } = useCesiumContext();

    const handleClose = () => {
        selectEntity(null);
    };

    const getEntityDetails = () => {
        if (!selectedEntityId || !selectedEntityType) return null;

        const store = entityStoreRef.current;

        if (selectedEntityType === 'flight') {
            let entity = store.civilianFlights.get(selectedEntityId.replace('civilian-', ''));
            if (!entity) entity = store.militaryFlights.get(selectedEntityId.replace('military-', ''));
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <Plane size={14} className="text-white/60" />,
                title: String(props?.callsign ?? selectedEntityId),
                type: 'FLIGHT',
                details: [
                    { label: 'ICAO', value: props?.icao24 || 'N/A' },
                    { label: 'ALT', value: props?.alt ? `${props.alt}M` : 'N/A' },
                    { label: 'SPD', value: props?.velocity ? `${props.velocity}M/S` : 'N/A' },
                    { label: 'HDG', value: props?.heading ? `${props.heading}°` : 'N/A' },
                    { label: 'ORG', value: props?.origin_country || 'N/A' },
                ],
            };
        }

        if (selectedEntityType === 'satellite') {
            let entity = store.satellites.get(selectedEntityId);
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <Satellite size={14} className="text-amber-400/70" />,
                title: String(props?.name ?? selectedEntityId),
                type: 'SATELLITE',
                details: [
                    { label: 'ALT', value: props?.height ? `${props.height.toFixed(0)}KM` : 'N/A' },
                    { label: 'ORB', value: props?.orbitType || 'N/A' },
                    { label: 'LAT', value: props?.lat?.toFixed(2) || 'N/A' },
                    { label: 'LON', value: props?.lon?.toFixed(2) || 'N/A' },
                ],
            };
        }

        if (selectedEntityType === 'cctv') {
            let entity = store.cctvMarkers.get(selectedEntityId.replace('cctv-', ''));
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <Camera size={14} className="text-cyan-400" />,
                title: String(props?.name ?? 'CCTV CAMERA'),
                type: 'CCTV',
                details: [
                    { label: 'CITY', value: props?.city || 'N/A' },
                    { label: 'URL', value: props?.url || 'N/A', isLink: true },
                ],
            };
        }

        if (selectedEntityType === 'ship') {
            let entity = store.ships.get(selectedEntityId.replace('ship-', ''));
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <Anchor size={14} className="text-blue-400" />,
                title: String(props?.name ?? selectedEntityId),
                type: 'VESSEL',
                details: [
                    { label: 'MMSI', value: props?.mmsi || 'N/A' },
                    { label: 'SPD', value: props?.speed ? `${props.speed}KN` : 'N/A' },
                    { label: 'HDG', value: props?.heading ? `${props.heading}°` : 'N/A' },
                    { label: 'DEST', value: props?.destination || 'N/A' },
                    { label: 'FLAG', value: props?.flag || 'N/A' },
                ],
            };
        }

        if (selectedEntityType === 'target') {
            const targetName = selectedEntityId.replace('target-', '');
            let entity = store.groundTargets.get(targetName);
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <MapPin size={14} className="text-red-500" />,
                title: String(targetName),
                type: 'STRATEGIC TARGET',
                details: [
                    { label: 'LAT', value: props?.lat?.toFixed(4) || 'N/A' },
                    { label: 'LON', value: props?.lon?.toFixed(4) || 'N/A' },
                ],
            };
        }

        return null;
    };

    const details = getEntityDetails();

    return (
        <AnimatePresence>
            {selectedEntityId && details && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="fixed top-14 right-4 z-40 w-64"
                >
                    <GlassPanel elevation="high" className="overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                {details.icon}
                                <div>
                                    <h3 className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-wider">{details.title}</h3>
                                    <p className="text-[7px] font-mono text-white/25 uppercase tracking-widest">{details.type}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-white/[0.06] rounded-sm transition-colors"
                            >
                                <X size={12} className="text-white/30" />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-3 space-y-1.5">
                            {details.details.map((detail, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider">
                                        {String(detail.label)}
                                    </span>
                                    {detail.isLink ? (
                                        <a
                                            href={String(detail.value)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[9px] font-mono text-cyan-400 hover:underline"
                                        >
                                            VIEW FEED
                                        </a>
                                    ) : (
                                        <span className="text-[9px] font-mono text-white/65">
                                            {typeof detail.value === 'object' && detail.value !== null
                                                ? JSON.stringify(detail.value)
                                                : String(detail.value)}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="px-3 pb-3 flex gap-1.5">
                            <button
                                onClick={() => {
                                    const viewer = viewerRef.current;
                                    const store = entityStoreRef.current;
                                    let entity: any = null;

                                    if (selectedEntityType === 'flight') {
                                        entity = store.civilianFlights.get(selectedEntityId.replace('civilian-', ''));
                                        if (!entity) entity = store.militaryFlights.get(selectedEntityId.replace('military-', ''));
                                    } else if (selectedEntityType === 'satellite') {
                                        entity = store.satellites.get(selectedEntityId);
                                    } else if (selectedEntityType === 'cctv') {
                                        entity = store.cctvMarkers.get(selectedEntityId.replace('cctv-', ''));
                                    } else if (selectedEntityType === 'ship') {
                                        entity = store.ships.get(selectedEntityId.replace('ship-', ''));
                                    } else if (selectedEntityType === 'target') {
                                        entity = store.groundTargets.get(selectedEntityId.replace('target-', ''));
                                    }

                                    if (entity?.position) {
                                        let pos = entity.position;
                                        if (pos && pos.getValue) {
                                            pos = pos.getValue(viewer.clock.currentTime);
                                        }
                                        if (pos) {
                                            viewer.camera.flyTo({
                                                destination: pos,
                                                duration: 1.5,
                                            });
                                        }
                                    }
                                }}
                                className="flex-1 py-1.5 px-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-[8px] font-mono font-medium tracking-wider uppercase transition-colors"
                            >
                                FLY TO
                            </button>
                        </div>
                    </GlassPanel>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
