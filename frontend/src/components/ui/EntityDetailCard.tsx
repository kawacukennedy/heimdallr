'use client';

import React from 'react';
import { Plane, Satellite, Camera, ArrowUp, MapPin } from 'lucide-react';
import GlassPanel from './GlassPanel';
import type { FlightData, MilitaryFlightData, SatelliteData, CCTVCamera } from '@/types';

interface EntityDetailCardProps {
    entityType: string | null;
    entityData: FlightData | MilitaryFlightData | SatelliteData | CCTVCamera | null;
    units?: 'metric' | 'imperial';
}

function DetailRow({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-b-0">
            <span className="text-xs text-white/50">{label}</span>
            <span className="text-xs text-white/90 font-mono">
                {value}{unit && <span className="text-white/40 ml-1">{unit}</span>}
            </span>
        </div>
    );
}

export default function EntityDetailCard({ entityType, entityData, units = 'metric' }: EntityDetailCardProps) {
    if (!entityData) {
        return (
            <div className="text-center py-6 text-white/30 text-sm">
                Select an entity on the map
            </div>
        );
    }

    const convertAlt = (meters: number) =>
        units === 'imperial' ? Math.round(meters * 3.28084) : Math.round(meters);
    const altUnit = units === 'imperial' ? 'ft' : 'm';

    const convertSpeed = (ms: number) =>
        units === 'imperial' ? Math.round(ms * 2.23694) : Math.round(ms * 3.6);
    const speedUnit = units === 'imperial' ? 'mph' : 'km/h';

    if (entityType === 'flight') {
        const flight = entityData as FlightData;
        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <Plane size={16} className="text-white" />
                    <span className="font-semibold text-white">{flight.callsign || flight.icao24}</span>
                </div>
                <DetailRow label="ICAO24" value={flight.icao24} />
                <DetailRow label="Callsign" value={flight.callsign || '—'} />
                <DetailRow label="Origin" value={flight.origin_country} />
                <DetailRow label="Altitude" value={convertAlt(flight.alt)} unit={altUnit} />
                <DetailRow label="Speed" value={convertSpeed(flight.velocity)} unit={speedUnit} />
                <DetailRow label="Heading" value={`${Math.round(flight.heading)}°`} />
                <DetailRow label="Vertical Rate" value={`${flight.vertical_rate > 0 ? '+' : ''}${flight.vertical_rate.toFixed(1)}`} unit="m/s" />
                <DetailRow label="Position" value={`${flight.lat.toFixed(4)}, ${flight.lon.toFixed(4)}`} />
            </div>
        );
    }

    if (entityType === 'military') {
        const mil = entityData as MilitaryFlightData;
        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <Plane size={16} className="text-orange-400" />
                    <span className="font-semibold text-white">{mil.callsign || mil.icao24}</span>
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">MIL</span>
                </div>
                <DetailRow label="ICAO24" value={mil.icao24} />
                <DetailRow label="Type" value={mil.type} />
                <DetailRow label="Altitude" value={convertAlt(mil.alt)} unit={altUnit} />
                <DetailRow label="Speed" value={convertSpeed(mil.speed)} unit={speedUnit} />
                <DetailRow label="Track" value={`${Math.round(mil.track)}°`} />
                <DetailRow label="Squawk" value={mil.squawk || '—'} />
                <DetailRow label="Category" value={mil.category || '—'} />
                <DetailRow label="Position" value={`${mil.lat.toFixed(4)}, ${mil.lon.toFixed(4)}`} />
            </div>
        );
    }

    if (entityType === 'satellite') {
        const sat = entityData as SatelliteData;
        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <Satellite size={16} className="text-yellow-400" />
                    <span className="font-semibold text-white">{sat.name}</span>
                    {sat.orbitType && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                            {sat.orbitType}
                        </span>
                    )}
                </div>
                <DetailRow label="ID" value={sat.id} />
                <DetailRow label="Name" value={sat.name} />
                {sat.height !== undefined && <DetailRow label="Altitude" value={Math.round(sat.height)} unit="km" />}
                {sat.lat !== undefined && <DetailRow label="Latitude" value={sat.lat.toFixed(4)} unit="°" />}
                {sat.lon !== undefined && <DetailRow label="Longitude" value={sat.lon.toFixed(4)} unit="°" />}
                {sat.period !== undefined && <DetailRow label="Period" value={sat.period} unit="min" />}
                <DetailRow label="TLE Line 1" value={sat.line1.substring(0, 30) + '...'} />
            </div>
        );
    }

    if (entityType === 'cctv') {
        const cam = entityData as CCTVCamera;
        return (
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-3">
                    <Camera size={16} className="text-blue-400" />
                    <span className="font-semibold text-white">{cam.label || cam.id}</span>
                </div>
                <DetailRow label="Camera ID" value={cam.id} />
                {cam.city && <DetailRow label="City" value={cam.city} />}
                <DetailRow label="Position" value={`${cam.lat.toFixed(4)}, ${cam.lon.toFixed(4)}`} />
                <DetailRow label="Heading" value={`${cam.heading}°`} />
                <DetailRow label="Pitch" value={`${cam.pitch}°`} />
                {/* CCTV image */}
                <div className="mt-3 w-full aspect-video rounded-lg bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden">
                    <Camera size={24} className="text-white/20" />
                </div>
            </div>
        );
    }

    return <div className="text-xs text-white/40">Unknown entity type</div>;
}
