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
    // State
    const [hasData, setHasData] = React.useState(false);
    const [hasMounted, setHasMounted] = React.useState(false);

    // Default messages
    const loadingMessage = properties.loadingMessage || 'Loading chart data...';
    const errorMessage = properties.errorMessage || 'Failed to load chart data';

    // Effect to update mounted state after first render
    React.useEffect(function () {
        setHasMounted(true);
    }, []);

    // Effect to update hasData state when loading or error changes
    React.useEffect(
        function () {
            if(!properties.isLoading && !properties.error) {
                setHasData(true);
            }
        },
        [properties.isLoading, properties.error],
    );

    // Show initial loading spinner only if no data yet
    if(properties.isLoading && !hasData) {
        return (
            <div className={mergeClassNames('flex h-[400px] items-center justify-center', properties.className)}>
                <div className="flex flex-col items-center gap-4">
                    <LoadingAnimation />
                    <p className="text-sm text-neutral-500">{loadingMessage}</p>
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
                    <p className="text-xs text-neutral-500">{properties.error.message}</p>
                </div>
            </div>
        );
    }

    // Render children with loading glow overlay when refreshing
    return (
        <div
            className={mergeClassNames(
                'relative',
                'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-md',
                'before:shadow-[inset_0_0_0_1px_rgba(168,85,247,0.6),inset_0_0_8px_rgba(168,85,247,0.4)]',
                'before:transition-opacity before:duration-300 before:content-[""]',
                'dark:before:shadow-[inset_0_0_0_1px_rgba(168,85,247,0.8),inset_0_0_8px_rgba(168,85,247,0.5)]',
                properties.isLoading && hasMounted ? 'before:opacity-100' : 'before:opacity-0',
                properties.className,
            )}
        >
            {properties.children}
        </div>
    );
}
