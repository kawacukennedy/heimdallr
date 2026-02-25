// Analytics utilities
export function trackPageView(path: string) { if (typeof window !== 'undefined') console.debug('[Analytics] pageView:', path); }
export function trackEvent(name: string, properties: Record<string, any> = {}) { if (typeof window !== 'undefined') console.debug('[Analytics] event:', name, properties); }
export function trackTiming(category: string, variable: string, ms: number) { console.debug(`[Analytics] timing: ${category}.${variable} = ${ms}ms`); }
