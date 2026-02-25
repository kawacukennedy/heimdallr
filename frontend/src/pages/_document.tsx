import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <meta name="description" content="Heimdallr – Real-time Geospatial Intelligence Dashboard with 3D photorealistic tiles, live aviation telemetry, satellite tracking, and CCTV feeds." />
                <meta name="theme-color" content="#000000" />
                <link rel="icon" href="/assets/icons/favicon.ico" />
                <link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png" />

                {/* Cesium CSS */}
                <link rel="stylesheet" href="/assets/cesium/Widgets/widgets.css" />

                {/* Inter font */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="bg-black text-white antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
