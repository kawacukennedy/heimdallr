// Math utilities
export function clamp(val: number, min: number, max: number): number { return Math.max(min, Math.min(max, val)); }
export function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
export function inverseLerp(a: number, b: number, val: number): number { return a === b ? 0 : (val - a) / (b - a); }
export function remap(inMin: number, inMax: number, outMin: number, outMax: number, val: number): number { return lerp(outMin, outMax, inverseLerp(inMin, inMax, val)); }
export function roundTo(num: number, decimals: number): number { const factor = 10 ** decimals; return Math.round(num * factor) / factor; }
export function randomRange(min: number, max: number): number { return Math.random() * (max - min) + min; }
export function degToRad(deg: number): number { return deg * Math.PI / 180; }
export function radToDeg(rad: number): number { return rad * 180 / Math.PI; }
export function normalizeAngle(deg: number): number { return ((deg % 360) + 360) % 360; }