// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationLink
export interface SideNavigationLinkInterface {
    title: React.ReactNode;
    href?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
export function SideNavigationLink(properties: SideNavigationLinkInterface) {
    // Hooks
    const urlPath = useUrlPath();

    // Components
    const Icon = properties.icon;

    const isActive = properties.href === urlPath;

    // Render the component
    return (
        <Link
            href={properties.href || '#'}
            className={mergeClassNames(
                'group flex items-center gap-x-2 rounded-md px-2 py-1 text-[13px] leading-6 hover:bg-light-2 dark:hover:bg-dark-3 dark:active:bg-dark-3',
                isActive
                    ? 'bg-light-1 text-dark dark:bg-dark-2 dark:text-light'
                    : 'text-dark hover:text-dark dark:bg-transparent dark:text-light-4',
            )}
        >
            {Icon && (
                <div className="relative h-4 w-4">
                    <Icon className="h-full w-full" />
                </div>
            )}
            {properties.title}
        </Link>
    );
}

// Export - Default
export default SideNavigationLink;
