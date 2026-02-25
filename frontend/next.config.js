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
        // ---- CesiumJS Configuration ----
        // Force Webpack to load the built CommonJS version of Cesium, completely bypassing 
        // the Next.js 14 SWC minifier bug with Cesium's ESM exports.
        config.plugins.push(
            new webpack.NormalModuleReplacementPlugin(
                /^cesium$/,
                path.resolve(__dirname, 'node_modules/cesium/Build/Cesium/index.cjs')
            )
        );

        if (!isServer) {
            config.plugins.push(
                new CopyPlugin({
                    patterns: [
                        {
                            from: path.join(
                                __dirname,
                                'node_modules/cesium/Build/Cesium/Workers'
                            ),
                            to: path.join(__dirname, 'public/assets/cesium/Workers'),
                        },
                        {
                            from: path.join(
                                __dirname,
                                'node_modules/cesium/Build/Cesium/ThirdParty'
                            ),
                            to: path.join(__dirname, 'public/assets/cesium/ThirdParty'),
                        },
                        {
                            from: path.join(
                                __dirname,
                                'node_modules/cesium/Build/Cesium/Assets'
                            ),
                            to: path.join(__dirname, 'public/assets/cesium/Assets'),
                        },
                        {
                            from: path.join(
                                __dirname,
                                'node_modules/cesium/Build/Cesium/Widgets'
                            ),
                            to: path.join(__dirname, 'public/assets/cesium/Widgets'),
                        },
                    ],
                })
            );

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
