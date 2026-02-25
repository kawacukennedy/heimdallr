/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                background: 'rgba(20, 20, 30, 0.7)',
                surface: 'rgba(30, 30, 40, 0.8)',
                'surface-light': 'rgba(50, 50, 60, 0.9)',
                border: 'rgba(255, 255, 255, 0.2)',
                accent: '#0a84ff',
                'accent-glow': '#409cff',
                success: '#30d158',
                warning: '#ff9f0a',
                danger: '#ff453a',
                'night-vision': '#7cfc00',
                'thermal-hot': '#ff4500',
            },
            fontFamily: {
                sans: [
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
                mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
            },
            fontSize: {
                headline: ['18px', { lineHeight: '24px', fontWeight: '600' }],
                body: ['14px', { lineHeight: '20px', fontWeight: '400' }],
                caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                xxl: '48px',
            },
            borderRadius: {
                panel: '12px',
                button: '8px',
                card: '10px',
            },
            backdropBlur: {
                panel: '20px',
                modal: '30px',
                heavy: '40px',
            },
            boxShadow: {
                panel: '0 10px 30px -10px rgba(0,0,0,0.5)',
                modal: '0 20px 40px -10px rgba(0,0,0,0.7)',
                button: '0 2px 8px rgba(0,0,0,0.3)',
                glow: '0 0 20px rgba(10, 132, 255, 0.3)',
            },
            zIndex: {
                map: '1',
                ui: '10',
                panel: '20',
                modal: '100',
                tooltip: '200',
            },
            transitionTimingFunction: {
                spring: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)',
            },
            animation: {
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
                'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
                'slide-in-bottom': 'slideInBottom 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                slideInBottom: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
