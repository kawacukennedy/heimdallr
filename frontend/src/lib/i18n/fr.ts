// French translations

import { Translation } from './en';

const fr: Translation = {
    app: {
        name: 'Heimdallr',
        tagline: 'Renseignement Géospatial en Temps Réel',
    },
    layers: {
        civilian: 'Vols civils',
        military: 'Vols militaires',
        satellites: 'Satellites',
        cctv: 'CCTV',
        traffic: 'Trafic routier',
    },
    shaders: {
        standard: 'Standard',
        nightVision: 'Vision Nocturne',
        thermal: 'Thermique (FLIR)',
        crt: 'Moniteur CRT',
        edgeDetection: 'Détection de contours',
    },
    panels: {
        controls: 'Contrôles',
        details: 'Détails',
        layers: 'Couches',
        shader: 'Shader',
        bookmarks: 'Signets',
    },
    settings: {
        title: 'Paramètres',
        general: 'Général',
        display: 'Affichage',
        data: 'Données',
        shortcuts: 'Raccourcis',
        about: 'À propos',
        units: 'Unités',
        metric: 'Métrique',
        imperial: 'Impérial',
        updateInterval: 'Intervalle de mise à jour',
        showFPS: 'Afficher les FPS',
        language: 'Langue',
    },
    search: {
        placeholder: 'Rechercher des lieux, vols, satellites...',
        noResults: 'Aucun résultat trouvé',
        searching: 'Recherche...',
    },
    errors: {
        mapRenderFailed: 'Erreur de rendu de la carte',
        webglUnavailable: 'WebGL n\'est pas disponible.',
        connectionLost: 'Connexion perdue',
        reconnecting: 'Reconnexion...',
    },
    time: {
        justNow: 'à l\'instant',
        minutesAgo: 'il y a {n}m',
        hoursAgo: 'il y a {n}h',
        daysAgo: 'il y a {n}j',
    },
};

export default fr;
