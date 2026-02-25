import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 – Not Found | Heimdallr</title>
            </Head>
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="glass-panel p-12 m-4 text-center max-w-md">
                    <div className="text-6xl font-bold text-accent/40 mb-4">404</div>
                    <h1 className="text-xl font-semibold mb-2">Location Not Found</h1>
                    <p className="text-sm text-white/50 mb-6">
                        The coordinates you&apos;re looking for don&apos;t exist in our database.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-2.5 bg-accent/15 border border-accent/30 rounded-button text-accent text-sm hover:bg-accent/25 transition-colors"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
}
