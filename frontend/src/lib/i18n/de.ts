// German translations
const de = {
    app: {
        name: 'Heimdallr',
        tagline: 'Echtzeit-Geospatial-Intelligence',
    },
    layers: {
        civilian: 'Zivile Flüge',
        military: 'Militärische Flüge',
        satellites: 'Satelliten',
        cctv: 'CCTV',
        traffic: 'Straßenverkehr',
    },
    shaders: {
        standard: 'Standard',
        nightVision: 'Nachtsicht',
        thermal: 'Thermie (FLIR)',
        crt: 'CRT-Monitor',
        edgeDetection: 'Kantenerkennung',
    },
    panels: {
        controls: 'Steuerung',
        details: 'Details',
        layers: 'Ebenen',
        shader: 'Shader',
        bookmarks: 'Lesezeichen',
    },
    settings: {
        title: 'Einstellungen',
        general: 'Allgemein',
        display: 'Anzeige',
        data: 'Daten',
        shortcuts: 'Tastenkombinationen',
        about: 'Über',
        units: 'Einheiten',
        metric: 'Metrisch',
        imperial: 'Imperial',
        updateInterval: 'Update-Intervall',
        showFPS: 'FPS anzeigen',
        language: 'Sprache',
    },
    search: {
        placeholder: 'Suche Orte, Flüge, Satelliten...',
        noResults: 'Keine Ergebnisse gefunden',
        searching: 'Suchen...',
    },
    errors: {
        mapRenderFailed: 'Karten-Rendering-Fehler',
        webglUnavailable: 'WebGL ist nicht verfügbar.',
        connectionLost: 'Verbindung unterbrochen',
        reconnecting: 'Verbinde neu...',
    },
    time: {
        justNow: 'gerade eben',
        minutesAgo: 'vor {n}m',
        hoursAgo: 'vor {n}h',
        daysAgo: 'vor {n}T',
    },
} as const;

export type TranslationKeys = typeof de;
export default de;
