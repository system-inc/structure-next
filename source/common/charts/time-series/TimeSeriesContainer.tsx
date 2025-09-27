'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Supporting Components
import { LoadingAnimation } from '@structure/source/common/animations/LoadingAnimation';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - TimeSeriesContainer
export interface TimeSeriesContainerProperties {
    children: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    loadingMessage?: string;
    error?: Error | null;
    errorMessage?: string;
}
export function TimeSeriesContainer(properties: TimeSeriesContainerProperties) {
    // Default messages
    const loadingMessage = properties.loadingMessage || 'Loading chart data...';
    const errorMessage = properties.errorMessage || 'Failed to load chart data';

    // Render loading state
    if(properties.isLoading) {
        return (
            <div className={mergeClassNames('flex h-[400px] items-center justify-center', properties.className)}>
                <div className="flex flex-col items-center gap-4">
                    <LoadingAnimation />
                    <p className="text-neutral-500 text-sm">{loadingMessage}</p>
                </div>
            </div>
        );
    }

    // Render error state
    if(properties.error) {
        return (
            <div className={mergeClassNames('flex h-[400px] items-center justify-center', properties.className)}>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-red-600">{errorMessage}</p>
                    <p className="text-neutral-500 text-xs">{properties.error.message}</p>
                </div>
            </div>
        );
    }

    // Render children
    return <div className={mergeClassNames('relative', properties.className)}>{properties.children}</div>;
}
