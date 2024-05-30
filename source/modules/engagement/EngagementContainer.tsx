'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { useEngagement } from '@structure/source/modules/engagement/EngagementProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - EngagementContainer
export interface EngagementContainerInterface extends React.HTMLAttributes<HTMLDivElement> {
    path: string;
}
export function EngagementContainer(properties: EngagementContainerInterface) {
    // Hooks
    const engagement = useEngagement();

    // Render the component
    return (
        <div></div>
        // <div className="fixed bottom-0 right-0 z-50 w-[420px] rounded-md border">Current path: {engagement.path}</div>
    );
}

// Export - Default
export default EngagementContainer;
