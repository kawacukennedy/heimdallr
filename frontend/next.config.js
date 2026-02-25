const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Transpile dependencies
    transpilePackages: ['@supabase/supabase-js', 'lucide-react', 'framer-motion'],

    images: {
        domains: ['tile.googleapis.com'],
        unoptimized: false,
    },

    webpack: (config, { isServer, webpack }) => {
        // Disable AMD for Cesium to prevent "Can't resolve './IPv6'" and similar errors
        config.module.unknownContextCritical = false;
        config.module.rules.push({
            test: /\.js$/,
            include: /node_modules[\\/]cesium/,
            parser: { amd: false },
        });

        if (!isServer) {
            config.plugins.push(
                new webpack.DefinePlugin({
                    CESIUM_BASE_URL: JSON.stringify('/assets/cesium'),
                })
            );
        }

        // ---- GLSL Shader Loader ----
        config.module.rules.push({
            test: /\.(glsl|vert|frag)$/,
            use: 'raw-loader',
            exclude: /node_modules/,
        });

        // Resolve fallbacks for Node.js modules (browser)
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                crypto: false,
            };
        }

        return config;
    },

    // Environment variables exposed to the browser
    env: {
        NEXT_PUBLIC_CESIUM_BASE_URL: '/assets/cesium',
    },
};

module.exports = withBundleAnalyzer(nextConfig);
