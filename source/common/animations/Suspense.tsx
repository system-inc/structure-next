// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { LoadingAnimation } from '@structure/source/common/animations/LoadingAnimation';

// Component - Suspense
export type SuspenseProperties = {
    children: React.ReactNode;
    content?: React.ReactNode;
};
export function Suspense(properties: SuspenseProperties) {
    // Use the provided fallback or default to LoadingAnimation
    const fallback = properties.content || <LoadingAnimation />;

    return <React.Suspense fallback={fallback}>{properties.children}</React.Suspense>;
}
