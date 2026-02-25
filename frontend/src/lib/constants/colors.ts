export const COLORS = {
    background: 'rgba(20, 20, 30, 0.7)',
    surface: 'rgba(30, 30, 40, 0.8)',
    surfaceLight: 'rgba(50, 50, 60, 0.9)',
    border: 'rgba(255, 255, 255, 0.2)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.7)',
    accent: '#0a84ff',
    accentGlow: '#409cff',
    success: '#30d158',
    warning: '#ff9f0a',
    danger: '#ff453a',
    nightVision: '#7cfc00',
    thermalHot: '#ff4500',
} as const;

export const CESIUM_COLORS = {
    civilianFlight: { r: 1, g: 1, b: 1, a: 1 }, // white
    militaryFlight: { r: 1, g: 0.647, b: 0, a: 1 }, // orange
    satelliteLEO: { r: 0, g: 1, b: 0, a: 1 }, // lime
    satelliteGEO: { r: 1, g: 1, b: 0, a: 1 }, // yellow
    cctvMarker: { r: 0, g: 0.52, b: 1, a: 1 }, // blue
    roadParticle: { r: 1, g: 1, b: 0, a: 0.8 }, // yellow
} as const;
