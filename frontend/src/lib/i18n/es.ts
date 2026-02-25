// i18n translations — Español

import { Translation } from './en';

const es: Translation = {
    app: {
        name: 'Heimdallr',
        tagline: 'Inteligencia Geoespacial en Tiempo Real',
    },
    layers: {
        civilian: 'Vuelos Civiles',
        military: 'Vuelos Militares',
        satellites: 'Satélites',
        cctv: 'CCTV',
        traffic: 'Tráfico Vial',
    },
    shaders: {
        standard: 'Estándar',
        nightVision: 'Visión Nocturna',
        thermal: 'Térmico (FLIR)',
        crt: 'Monitor CRT',
        edgeDetection: 'Detección de Bordes',
    },
    panels: {
        controls: 'Controles',
        details: 'Detalles',
        layers: 'Capas',
        shader: 'Shader',
        bookmarks: 'Marcadores',
    },
    settings: {
        title: 'Configuración',
        general: 'General',
        display: 'Pantalla',
        data: 'Datos',
        shortcuts: 'Atajos',
        about: 'Acerca de',
        units: 'Unidades',
        metric: 'Métrico',
        imperial: 'Imperial',
        updateInterval: 'Intervalo de actualización',
        showFPS: 'Mostrar FPS',
        language: 'Idioma',
    },
    search: {
        placeholder: 'Buscar ubicaciones, vuelos, satélites...',
        noResults: 'Sin resultados',
        searching: 'Buscando...',
    },
    errors: {
        mapRenderFailed: 'Error de Renderizado del Mapa',
        webglUnavailable: 'WebGL no está disponible en este dispositivo.',
        connectionLost: 'Conexión perdida',
        reconnecting: 'Reconectando...',
    },
    time: {
        justNow: 'ahora',
        minutesAgo: 'hace {n}m',
        hoursAgo: 'hace {n}h',
        daysAgo: 'hace {n}d',
    },
};

export default es;
