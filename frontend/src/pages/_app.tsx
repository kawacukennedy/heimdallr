import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { CesiumProvider } from '@/providers/CesiumProvider';
import { RealtimeProvider } from '@/providers/RealtimeProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import ToastContainer from '@/components/ui/Toast';
import React from 'react';

// Error boundary
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-black text-white">
                    <div className="glass-panel p-8 m-4 max-w-md text-center">
                        <h2 className="text-xl font-bold text-danger mb-4">Something went wrong</h2>
                        <p className="text-sm text-white/60 mb-4">{this.state.error?.message}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-accent/20 border border-accent/40 rounded-button text-accent hover:bg-accent/30 transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ErrorBoundary>
            <CesiumProvider>
                <RealtimeProvider>
                    <ToastProvider>
                        <Component {...pageProps} />
                        <ToastContainer />
                    </ToastProvider>
                </RealtimeProvider>
            </CesiumProvider>
        </ErrorBoundary>
    );
}
