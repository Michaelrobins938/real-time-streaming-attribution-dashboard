"use client";

import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Dashboard Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen carbon-fiber flex items-center justify-center">
                    <div className="carbon-plate border border-red-600/30 p-12 max-w-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 border border-red-600 flex items-center justify-center">
                                <span className="text-red-600 text-2xl">⚠</span>
                            </div>
                            <h1 className="text-2xl font-black uppercase text-white">System Error</h1>
                        </div>
                        <p className="text-zinc-400 mb-6 font-mono">
                            Dashboard encountered an unexpected error. Please refresh the page to continue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                        >
                            Reload System
                        </button>
                        {this.state.error && (
                            <details className="mt-6">
                                <summary className="text-xs text-zinc-600 font-mono cursor-pointer uppercase tracking-widest">Error Details</summary>
                                <pre className="mt-2 text-xs text-zinc-500 font-mono overflow-auto max-h-32">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
