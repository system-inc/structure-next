'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { IdeaControl } from '@structure/source/modules/idea/common/idea/controls/IdeaControl';

// Dependencies - Assets
import ArrowUpIcon from '@structure/assets/icons/interface/ArrowUpIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - IdeaMiniVoteControl
export interface IdeaMiniVoteControlInterface {
    className?: string;
    upvotes: number;
}
export function IdeaMiniVoteControl(properties: IdeaMiniVoteControlInterface) {
    // Render the component
    return (
        <IdeaControl className="space-x-1.5 md:hidden">
            <ArrowUpIcon className="h-3.5 w-3.5" />
            <div className="">{properties.upvotes}</div>
        </IdeaControl>
    );
}

// Export - Default
export default IdeaMiniVoteControl;
