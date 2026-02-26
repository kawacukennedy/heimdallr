'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useCesiumContext } from '@/providers/CesiumProvider';
import { useUIStore } from '@/store/uiStore';
import { getSupabaseClient } from '@/lib/realtime/supabaseClient';
import { CHANNELS } from '@/lib/realtime/channels';
import type { FlightData, MilitaryFlightData } from '@/types';

export default function EntityLayers() {
    const { viewerRef, entityStoreRef } = useCesiumContext();
    const layers = useUIStore((s) => s.layers);
    const selectEntity = useUIStore((s) => s.selectEntity);
    const cesiumRef = useRef<typeof import('cesium') | null>(null);
    const sgp4WorkerRef = useRef<Worker | null>(null);
    const animFrameRef = useRef<number>(0);
    const deadReckoningWorkerRef = useRef<Worker | null>(null);

    // Load Cesium module
    useEffect(() => {
        import('cesium').then((mod) => {
            cesiumRef.current = mod;
        });
    }, []);

    // ==========================
    // Civilian Flights Layer
    // ==========================
    
    // Store flight data for CallbackProperty access
    const flightDataRef = useRef<Map<string, FlightData>>(new Map());

    const updateCivilianFlights = useCallback(
        (payload: FlightData[]) => {
            const Cesium = cesiumRef.current;
            const viewer = viewerRef.current;
            const store = entityStoreRef.current.civilianFlights;
            const layerVisible = useUIStore.getState().layers.civilian;
            if (!Cesium || !viewer || !payload) return;

            payload.forEach((flight) => {
                // Store flight data for callback
                flightDataRef.current.set(flight.icao24, flight);
                
                let entity = store.get(flight.icao24);
                if (!entity) {
                    // Create CallbackProperty for dynamic position
                    const positionCallback = new Cesium.CallbackProperty((time, result) => {
                        const data = flightDataRef.current.get(flight.icao24);
                        if (data) {
                            return Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.alt);
                        }
                        return Cesium.Cartesian3.fromDegrees(flight.lon, flight.lat, flight.alt);
                    }, false);
                    
                    entity = viewer.entities.add({
                        id: `civilian-${flight.icao24}`,
                        position: positionCallback,
                        point: {
                            pixelSize: 6,
                            color: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1,
                            show: layerVisible,
                        },
                        label: {
                            text: flight.callsign || flight.icao24,
                            show: false,
                            font: '12px Inter, sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.BLACK,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -12),
                            scale: 0.8,
                        },
                        properties: flight as any,
                    });
                    store.set(flight.icao24, entity);
                } else {
                    // Update properties for callback to read
                    if (entity.properties) {
                        (entity as any).properties = flight;
                    }
                }
            });
            
            // Remove flights that are no longer in the data
            const currentIcaos = new Set(payload.map(f => f.icao24));
            store.forEach((entity, icao) => {
                if (!currentIcaos.has(icao)) {
                    viewer.entities.remove(entity);
                    store.delete(icao);
                    flightDataRef.current.delete(icao);
                }
            });

            viewer.scene.requestRender();
        },
        [viewerRef, entityStoreRef]
    );

    // ==========================
    // Military Flights Layer
    // ==========================
    const militaryFlightDataRef = useRef<Map<string, MilitaryFlightData>>(new Map());

    const updateMilitaryFlights = useCallback(
        (payload: MilitaryFlightData[]) => {
            const Cesium = cesiumRef.current;
            const viewer = viewerRef.current;
            const store = entityStoreRef.current.militaryFlights;
            const layerVisible = useUIStore.getState().layers.military;
            if (!Cesium || !viewer || !payload) return;

            payload.forEach((flight) => {
                // Store flight data for callback
                militaryFlightDataRef.current.set(flight.icao24, flight);
                
                let entity = store.get(flight.icao24);
                if (!entity) {
                    // Determine model based on aircraft type
                    const modelUri = flight.type === 'F16'
                        ? '/assets/models/f16.glb'
                        : flight.type === 'Su57'
                            ? '/assets/models/su57.glb'
                            : undefined;

                    // Create CallbackProperty for dynamic position
                    const positionCallback = new Cesium.CallbackProperty((time, result) => {
                        const data = militaryFlightDataRef.current.get(flight.icao24);
                        if (data) {
                            return Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.alt);
                        }
                        return Cesium.Cartesian3.fromDegrees(flight.lon, flight.lat, flight.alt);
                    }, false);

                    entity = viewer.entities.add({
                        id: `military-${flight.icao24}`,
                        position: positionCallback,
                        point: {
                            pixelSize: 8,
                            color: Cesium.Color.ORANGE,
                            outlineColor: Cesium.Color.RED,
                            outlineWidth: 1,
                            show: layerVisible && !modelUri,
                        },
                        ...(modelUri ? {
                            model: {
                                uri: modelUri,
                                show: layerVisible,
                                minimumPixelSize: 64,
                            }
                        } : {}),
                        label: {
                            text: flight.callsign || flight.icao24,
                            show: false,
                            font: '12px Inter, sans-serif',
                            fillColor: Cesium.Color.ORANGE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.BLACK,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -12),
                            scale: 0.8,
                        },
                        properties: flight as any,
                    });
                    store.set(flight.icao24, entity);
                }
            });

            // Remove flights that are no longer in the data
            const currentIcaos = new Set(payload.map(f => f.icao24));
            store.forEach((entity, icao) => {
                if (!currentIcaos.has(icao)) {
                    viewer.entities.remove(entity);
                    store.delete(icao);
                    militaryFlightDataRef.current.delete(icao);
                }
            });

            viewer.scene.requestRender();
        },
        [viewerRef, entityStoreRef]
    );

    // ==========================
    // Flight Dead Reckoning Worker - Single unified worker
    // ==========================
    const cesiumReadyRef = useRef(false);
    const workerInitializedRef = useRef(false);

    // Initialize worker once when Cesium loads
    useEffect(() => {
        if (workerInitializedRef.current) return;
        
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        
        if (!Cesium || !viewer) {
            // Cesium not ready yet
            return;
        }

        cesiumReadyRef.current = true;
        workerInitializedRef.current = true;

        // Create single worker
        try {
            const worker = new Worker(
                new URL('../../workers/deadReckoning.worker.ts', import.meta.url),
                { type: 'module' }
            );
            deadReckoningWorkerRef.current = worker;

            // Handle interpolated positions from worker
            worker.onmessage = (e) => {
                if (e.data.type === 'positions') {
                    const storeCiv = entityStoreRef.current.civilianFlights;
                    const storeMil = entityStoreRef.current.militaryFlights;

                    e.data.positions.forEach((pos: any) => {
                        const entity = storeCiv.get(pos.icao24) || storeMil.get(pos.icao24);
                        if (entity) {
                            entity.position = Cesium.Cartesian3.fromDegrees(
                                pos.lon, pos.lat, pos.alt
                            ) as any;
                        }
                    });
                    viewer.scene.requestRender();
                }
            };

            // Start interpolation loop
            const interpolate = () => {
                const currentLayers = useUIStore.getState().layers;
                if (currentLayers.civilian || currentLayers.military) {
                    worker.postMessage({ type: 'interpolate' });
                }
                animFrameRef.current = requestAnimationFrame(interpolate);
            };
            animFrameRef.current = requestAnimationFrame(interpolate);

            console.log('[EntityLayers] Dead reckoning worker initialized');
        } catch (e) {
            console.warn('Dead reckoning worker not available', e);
        }

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            deadReckoningWorkerRef.current?.terminate();
            deadReckoningWorkerRef.current = null;
            workerInitializedRef.current = false;
        };
    }, [viewerRef, entityStoreRef]);

    // ==========================
    // Satellite Layer (SGP4 Worker)
    // ==========================
    useEffect(() => {
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        if (!Cesium || !viewer || !layers.satellites) return;

        console.log('[EntityLayers] Initializing satellite layer...');

        // Initialize SGP4 worker
        let worker: Worker;
        try {
            worker = new Worker(
                new URL('../../workers/sgp4.worker.ts', import.meta.url),
                { type: 'module' }
            );
        } catch (e) {
            console.warn('[EntityLayers] SGP4 worker not available:', e);
            return;
        }
        sgp4WorkerRef.current = worker;

        // Fetch TLEs from backend and initialize worker
        const initSatellites = async () => {
            try {
                const res = await fetch(`/api/satellites/tle`);
                console.log('[EntityLayers] TLE fetch status:', res.status);
                if (!res.ok) return;
                const data = await res.json();
                console.log('[EntityLayers] TLE data received, count:', Array.isArray(data) ? data.length : 'N/A');
                worker.postMessage({ type: 'init', tles: data.tle_data || data.tles || data });
            } catch (err) {
                console.warn('[EntityLayers] Failed to fetch TLE data:', err);
            }
        };

        // Handle worker results
        worker.onmessage = (e) => {
            if (e.data.type === 'result') {
                const store = entityStoreRef.current.satellites;
                const positions = e.data.positions;

                console.log(`[EntityLayers] Processing ${positions.length} satellite positions`);

                positions.forEach((pos: any) => {
                    let entity = store.get(pos.id);
                    if (!entity) {
                        const color = pos.orbitType === 'LEO'
                            ? Cesium.Color.LIME
                            : pos.orbitType === 'GEO'
                                ? Cesium.Color.YELLOW
                                : Cesium.Color.CYAN;

                        entity = viewer.entities.add({
                            id: pos.id,
                            position: Cesium.Cartesian3.fromDegrees(pos.lon, pos.lat, pos.height * 1000),
                            point: {
                                pixelSize: 4,
                                color,
                                show: layers.satellites,
                            },
                            label: {
                                text: pos.name,
                                show: false,
                                font: '10px Inter, sans-serif',
                                fillColor: Cesium.Color.WHITE,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                outlineWidth: 1,
                                outlineColor: Cesium.Color.BLACK,
                                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                pixelOffset: new Cesium.Cartesian2(0, -8),
                                scale: 0.7,
                            },
                            path: {
                                leadTime: 5400, // 90 minutes
                                trailTime: 5400,
                                resolution: 120,
                                width: 1,
                                material: new Cesium.PolylineGlowMaterialProperty({
                                    glowPower: 0.2,
                                    color: Cesium.Color.WHITE.withAlpha(0.3),
                                }),
                            },
                            properties: pos as any,
                        });
                        store.set(pos.id, entity);
                    } else {
                        entity.position = Cesium.Cartesian3.fromDegrees(
                            pos.lon, pos.lat, pos.height * 1000
                        ) as any;
                    }
                });

                viewer.scene.requestRender();
            }
        };

        initSatellites();

        // Send tick messages at animation frame rate
        const animate = () => {
            worker.postMessage({ type: 'tick', time: new Date().toISOString() });
            animFrameRef.current = requestAnimationFrame(animate);
        };
        // Delay start until worker is initialized
        const startTimeout = setTimeout(() => {
            animFrameRef.current = requestAnimationFrame(animate);
        }, 2000);

        return () => {
            clearTimeout(startTimeout);
            cancelAnimationFrame(animFrameRef.current);
            worker.terminate();
            sgp4WorkerRef.current = null;
        };
    }, [viewerRef, entityStoreRef, layers.satellites]);

    // ==========================
    // CCTV Markers Layer (Postgres Changes)
    // ==========================
    useEffect(() => {
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        if (!Cesium || !viewer) return;

        console.log('[EntityLayers] Initializing CCTV layer...');

        const supabase = getSupabaseClient();
        const store = entityStoreRef.current.cctvMarkers;

        // Load initial CCTV cameras from live API
        const loadInitialCameras = async () => {
            try {
                const res = await fetch('/api/cctv/live');
                console.log('[EntityLayers] CCTV fetch status:', res.status);
                if (!res.ok) return;

                const data = await res.json();
                console.log(`[EntityLayers] Loading ${data.length} CCTV cameras`);

                data.forEach((cam: any) => {
                    const lon = cam.location?.coordinates?.[0] ?? cam.lon ?? 0;
                    const lat = cam.location?.coordinates?.[1] ?? cam.lat ?? 0;

                    if (lon === 0 && lat === 0) return; // Skip invalid coordinates

                    const entity = viewer.entities.add({
                        id: `cctv-${cam.id}`,
                        position: Cesium.Cartesian3.fromDegrees(lon, lat, 10),
                        point: {
                            pixelSize: 8,
                            color: Cesium.Color.CYAN,
                            outlineColor: Cesium.Color.BLUE,
                            outlineWidth: 1,
                            show: layers.cctv,
                        },
                        label: {
                            text: cam.name || cam.description || 'CCTV',
                            show: false,
                            font: '10px Inter, sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 1,
                            outlineColor: Cesium.Color.BLACK,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                        },
                        properties: {
                            heading: cam.heading,
                            pitch: cam.pitch,
                            url: cam.url || cam.source_url,
                            city: cam.city,
                        } as any,
                    });
                    store.set(cam.id, entity);
                });
                viewer.scene.requestRender();
            } catch (err) {
                console.warn('[EntityLayers] Failed to load CCTV cameras:', err);
            }
        };

        loadInitialCameras();

        // Subscribe to postgres_changes on cctv_cameras table
        const cctvChannel = supabase
            .channel('cctv-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'cctv_cameras' },
                (payload: any) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const cam = payload.new;
                        const lon = cam.location?.coordinates?.[0] ?? 0;
                        const lat = cam.location?.coordinates?.[1] ?? 0;
                        const existing = store.get(cam.id);
                        if (existing) {
                            existing.position = Cesium.Cartesian3.fromDegrees(lon, lat, 10) as any;
                        } else {
                            const entity = viewer.entities.add({
                                id: `cctv-${cam.id}`,
                                position: Cesium.Cartesian3.fromDegrees(lon, lat, 10),
                                model: {
                                    uri: '/assets/models/cctv_camera.glb',
                                    scale: 10,
                                    minimumPixelSize: 32,
                                    show: layers.cctv,
                                },
                                properties: {
                                    heading: cam.heading,
                                    pitch: cam.pitch,
                                    url: cam.source_url,
                                } as any,
                            });
                            store.set(cam.id, entity);
                        }
                    } else if (payload.eventType === 'DELETE') {
                        const entity = store.get(payload.old.id);
                        if (entity) {
                            viewer.entities.remove(entity);
                            store.delete(payload.old.id);
                        }
                    }
                    viewer.scene.requestRender();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(cctvChannel);
        };
    }, [viewerRef, entityStoreRef, layers.cctv]);

    // ==========================
    // Road Traffic Layer
    // ==========================
    useEffect(() => {
        const Cesium = cesiumRef.current;
        const viewer = viewerRef.current;
        if (!Cesium || !viewer || !layers.traffic) return;

        const store = entityStoreRef.current.roadParticles;

        const loadRoads = async () => {
            try {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || '';
                // Load a default city; can be expanded to viewport-based loading
                const res = await fetch(`${backendUrl}/api/roads/default`);
                if (!res.ok) {
                    console.warn('[EntityLayers] Roads API returned:', res.status);
                    return;
                }
                const data = await res.json();
                const features = data.features || data;

                if (!Array.isArray(features)) {
                    console.warn('[EntityLayers] Roads data is not an array:', typeof features);
                    return;
                }

                console.log(`[EntityLayers] Loading ${features.length} road features`);

                features.forEach((feature: any, idx: number) => {
                    const coords = feature.geometry?.coordinates ||
                        feature.interpolated_points ||
                        feature.coordinates;
                    if (!coords || !Array.isArray(coords) || coords.length < 2) return;

                    const positions = Cesium.Cartesian3.fromDegreesArray(
                        coords.flat().slice(0, 200) // Limit points per road
                    );

                    const entity = viewer.entities.add({
                        id: `road-${feature.id || idx}`,
                        polyline: {
                            positions,
                            width: 2,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                glowPower: 0.3,
                                color: Cesium.Color.YELLOW.withAlpha(0.4),
                            }),
                            show: layers.traffic,
                        },
                    });
                    store.set(feature.id || `road-${idx}`, entity);
                });

                viewer.scene.requestRender();
            } catch (err) {
                console.warn('[EntityLayers] Failed to load road data:', err);
            }
        };

        loadRoads();

        return () => {
            // Cleanup road entities when layer is disabled
            store.forEach((entity) => viewer.entities.remove(entity));
            store.clear();
        };
    }, [viewerRef, entityStoreRef, layers.traffic]);

    // ==========================
    // Subscribe to Realtime channels
    // ==========================
    const civilianCallbackRef = useRef(updateCivilianFlights);
    const militaryCallbackRef = useRef(updateMilitaryFlights);
    civilianCallbackRef.current = updateCivilianFlights;
    militaryCallbackRef.current = updateMilitaryFlights;

    useEffect(() => {
        const supabase = getSupabaseClient();

        console.log('[EntityLayers] Setting up realtime subscriptions...');

        const civilianChannel = supabase
            .channel(CHANNELS.CIVILIAN_FLIGHTS)
            .on('broadcast', { event: 'update' }, (msg: any) => {
                console.log('[EntityLayers] Received civilian flights:', msg.payload?.length);
                civilianCallbackRef.current(msg.payload);
            })
            .subscribe((status) => {
                console.log('[EntityLayers] Civilian channel status:', status);
            });

        const militaryChannel = supabase
            .channel(CHANNELS.MILITARY_FLIGHTS)
            .on('broadcast', { event: 'update' }, (msg: any) => {
                console.log('[EntityLayers] Received military flights:', msg.payload?.length);
                militaryCallbackRef.current(msg.payload);
            })
            .subscribe((status) => {
                console.log('[EntityLayers] Military channel status:', status);
            });

        return () => {
            supabase.removeChannel(civilianChannel);
            supabase.removeChannel(militaryChannel);
        };
    }, []);

    // ==========================
    // Layer visibility sync
    // ==========================
    useEffect(() => {
        const store = entityStoreRef.current;
        store.civilianFlights.forEach((entity) => {
            if (entity.point) entity.point.show = layers.civilian;
        });
        store.militaryFlights.forEach((entity) => {
            if (entity.point) entity.point.show = layers.military;
            if (entity.model) entity.model.show = layers.military;
        });
        store.satellites.forEach((entity) => {
            if (entity.point) entity.point.show = layers.satellites;
        });
        store.cctvMarkers.forEach((entity) => {
            if (entity.model) entity.model.show = layers.cctv;
        });
        store.roadParticles.forEach((entity) => {
            if (entity.polyline) entity.polyline.show = layers.traffic;
        });
        viewerRef.current?.scene.requestRender();
    }, [layers, entityStoreRef, viewerRef]);

    // ==========================
    // Entity click handler
    // ==========================
    useEffect(() => {
        const viewer = viewerRef.current;
        const Cesium = cesiumRef.current;
        if (!viewer || !Cesium) return;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction((click: any) => {
            const pickedObject = viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject) && pickedObject.id) {
                const entityId = pickedObject.id.id || pickedObject.id;
                const type = typeof entityId === 'string' && entityId.includes('civilian')
                    ? 'flight'
                    : entityId.includes('military')
                        ? 'military'
                        : entityId.includes('sat-')
                            ? 'satellite'
                            : entityId.includes('cctv')
                                ? 'cctv'
                                : null;
                selectEntity(entityId, type);

                // Show label on selected entity
                const entity = pickedObject.id;
                if (entity.label) {
                    entity.label.show = true;
                }
            } else {
                selectEntity(null);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return () => {
            handler.destroy();
        };
    }, [viewerRef, selectEntity]);

    return null; // This component manages Cesium entities imperatively
}
