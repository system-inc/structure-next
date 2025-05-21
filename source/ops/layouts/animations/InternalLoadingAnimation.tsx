// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { LoadingAnimation } from '@structure/source/common/animations/LoadingAnimation';

// Component - InternalLoading
export function InternalLoading() {
    // Render the component
    return (
        <div className={`flex h-full w-full items-center justify-center px-4 sm:px-6 lg:px-8`}>
            <LoadingAnimation />
            <p className="pl-2 text-center text-lg font-medium">Loading...</p>
        </div>
    );
}
