'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Satellite, Camera, X, MapPin, Navigation, Clock, Speed } from 'lucide-react';
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
                icon: <Plane size={20} className="text-white/80" />,
                title: props?.callsign || selectedEntityId,
                type: 'Flight',
                details: [
                    { label: 'ICAO', value: props?.icao24 || 'N/A' },
                    { label: 'Altitude', value: props?.alt ? `${props.alt} m` : 'N/A' },
                    { label: 'Speed', value: props?.velocity ? `${props.velocity} m/s` : 'N/A' },
                    { label: 'Heading', value: props?.heading ? `${props.heading}°` : 'N/A' },
                    { label: 'Country', value: props?.origin_country || 'N/A' },
                ],
            };
        }

        if (selectedEntityType === 'satellite') {
            let entity = store.satellites.get(selectedEntityId);
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <Satellite size={20} className="text-white/80" />,
                title: props?.name || selectedEntityId,
                type: 'Satellite',
                details: [
                    { label: 'Altitude', value: props?.height ? `${props.height.toFixed(0)} km` : 'N/A' },
                    { label: 'Orbit Type', value: props?.orbitType || 'N/A' },
                    { label: 'Latitude', value: props?.lat?.toFixed(2) || 'N/A' },
                    { label: 'Longitude', value: props?.lon?.toFixed(2) || 'N/A' },
                ],
            };
        }

        if (selectedEntityType === 'cctv') {
            let entity = store.cctvMarkers.get(selectedEntityId.replace('cctv-', ''));
            if (!entity) return null;

            const props = entity.properties;
            return {
                icon: <Camera size={20} className="text-white/80" />,
                title: props?.name || 'CCTV Camera',
                type: 'CCTV',
                details: [
                    { label: 'City', value: props?.city || 'N/A' },
                    { label: 'URL', value: props?.url || 'N/A', isLink: true },
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
                    className="fixed top-20 right-4 z-40 w-80"
                >
                    <GlassPanel elevation="high" className="overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                {details.icon}
                                <div>
                                    <h3 className="text-white font-medium text-sm">{details.title}</h3>
                                    <p className="text-white/40 text-xs">{details.type}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={16} className="text-white/50" />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                            {details.details.map((detail, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <span className="text-white/40 text-xs flex items-center gap-1">
                                        {detail.label === 'Altitude' || detail.label === 'Speed' ? <Speed size={10} /> :
                                            detail.label === 'Latitude' || detail.label === 'Longitude' ? <Navigation size={10} /> :
                                                <MapPin size={10} />}
                                        {detail.label}
                                    </span>
                                    {detail.isLink ? (
                                        <a
                                            href={detail.value}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent text-xs hover:underline truncate max-w-[150px]"
                                        >
                                            View Camera
                                        </a>
                                    ) : (
                                        <span className="text-white text-xs font-medium">{detail.value}</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="p-4 pt-0 flex gap-2">
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
                                    }

                                    if (entity?.position) {
                                        let pos = entity.position;
                                        // If it's a CallbackProperty, get the value
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
                                className="flex-1 py-2 px-4 bg-accent/20 hover:bg-accent/30 text-accent text-xs font-medium rounded-lg transition-colors"
                            >
                                Fly To
                            </button>
                        </div>
                    </GlassPanel>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
