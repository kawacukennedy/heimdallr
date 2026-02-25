import Head from 'next/head';

export default function Custom500() {
    return (
        <>
            <Head>
                <title>500 – Server Error | Heimdallr</title>
            </Head>
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="glass-panel p-12 m-4 text-center max-w-md">
                    <div className="text-6xl font-bold text-danger/40 mb-4">500</div>
                    <h1 className="text-xl font-semibold mb-2">System Error</h1>
                    <p className="text-sm text-white/50 mb-6">
                        An internal error occurred. Our monitoring systems have been alerted.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-accent/15 border border-accent/30 rounded-button text-accent text-sm hover:bg-accent/25 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        </>
    );
}
