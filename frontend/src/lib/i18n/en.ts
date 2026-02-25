// i18n translations — English (default)

const en = {
    app: {
        name: 'Heimdallr',
        tagline: 'Real-Time Geospatial Intelligence',
    },
    layers: {
        civilian: 'Civilian Flights',
        military: 'Military Flights',
        satellites: 'Satellites',
        cctv: 'CCTV',
        traffic: 'Road Traffic',
    },
    shaders: {
        standard: 'Standard',
        nightVision: 'Night Vision',
        thermal: 'Thermal (FLIR)',
        crt: 'CRT Monitor',
        edgeDetection: 'Edge Detection',
    },
    panels: {
        controls: 'Controls',
        details: 'Details',
        layers: 'Layers',
        shader: 'Shader',
        bookmarks: 'Bookmarks',
    },
    settings: {
        title: 'Settings',
        general: 'General',
        display: 'Display',
        data: 'Data',
        shortcuts: 'Shortcuts',
        about: 'About',
        units: 'Units',
        metric: 'Metric',
        imperial: 'Imperial',
        updateInterval: 'Update interval',
        showFPS: 'Show FPS',
        language: 'Language',
    },
    search: {
        placeholder: 'Search locations, flights, satellites...',
        noResults: 'No results found',
        searching: 'Searching...',
    },
    errors: {
        mapRenderFailed: 'Map Rendering Error',
        webglUnavailable: 'WebGL is not available on this device.',
        connectionLost: 'Connection lost',
        reconnecting: 'Reconnecting...',
    },
    time: {
        justNow: 'just now',
        minutesAgo: '{n}m ago',
        hoursAgo: '{n}h ago',
        daysAgo: '{n}d ago',
    },
};

export type Translation = typeof en;
export default en;
