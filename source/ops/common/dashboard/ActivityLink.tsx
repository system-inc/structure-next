// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { timeAgo } from '@structure/source/utilities/Time';

// Component - ActivityLink
export type ActivityLinkProperties = {
    href: string;
    title: string;
    timeAgo: number;
};
export function ActivityLink(properties: ActivityLinkProperties) {
    // Render the component
    return (
        <Link href={properties.href} className="group flex transition-all">
            <div>
                <p className="text-sm font-light">{properties.title}</p>
                <p className="text-xs font-light text-dark-4/50 dark:text-light-4/50">{timeAgo(properties.timeAgo)}</p>
            </div>
            <div className="flex items-center justify-start opacity-0 transition-opacity group-hover:opacity-100">
                <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

// Export - Default
export default ActivityLink;
