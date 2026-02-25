# 3D Models Directory

This directory contains glTF/GLB 3D models used by Cesium for entity rendering.

## Required Models

| File | Usage | Source |
|------|-------|--------|
| `f16.glb` | F-16 military fighter jet | [Sketchfab CC0 model] |
| `su57.glb` | Su-57 military aircraft | [Sketchfab CC0 model] |
| `satellite.glb` | Generic satellite | [Sketchfab CC0 model] |
| `cctv_camera.glb` | CCTV camera marker | [Sketchfab CC0 model] |
| `commercial_aircraft.glb` | Commercial airliner | [Sketchfab CC0 model] |
| `drone.glb` | Drone/UAV | [Sketchfab CC0 model] |

## Notes

- Models should be in GLB (binary glTF) format for optimal loading performance.
- Keep models under 2MB each for fast streaming.
- Models are loaded lazily by Cesium when entities using them become visible.
- Place actual .glb files in this directory to enable 3D model rendering.
