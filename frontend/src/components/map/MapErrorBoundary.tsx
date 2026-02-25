'use client';

import React from 'react';

interface MapErrorBoundaryProps {
    children: React.ReactNode;
}

interface MapErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export default class MapErrorBoundary extends React.Component<
    MapErrorBoundaryProps,
    MapErrorBoundaryState
> {
    constructor(props: MapErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[MapErrorBoundary] Caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="glass-panel p-8 max-w-md text-center">
                        <div className="text-4xl mb-4">🌍</div>
                        <h2 className="text-xl font-bold text-danger mb-3">
                            Map Rendering Error
                        </h2>
                        <p className="text-sm text-white/60 mb-2">
                            {this.state.error?.message || 'The 3D map failed to initialize.'}
                        </p>
                        <p className="text-xs text-white/40 mb-6">
                            This may be caused by WebGL not being available or insufficient GPU memory.
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="px-6 py-2.5 bg-accent/15 border border-accent/30 rounded-button text-accent text-sm hover:bg-accent/25 transition-colors"
                        >
                            Reload Map
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
