// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - SideNavigationLink
export interface SideNavigationLinkProperties {
    title: React.ReactNode;
    href?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
export function SideNavigationLink(properties: SideNavigationLinkProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // Components

    const isActive = properties.href === urlPath;

    // Render the component
    return (
        <Link
            href={properties.href || '#'}
            className={mergeClassNames(
                'group hover:bg-light-2 dark:hover:bg-dark-3 dark:active:bg-dark-3 flex items-center gap-x-2 rounded-md px-2 py-1 text-[13px] leading-6',
                isActive
                    ? 'text-dark dark:bg-dark-2 dark:text-light background--c'
                    : 'text-dark hover:content--a-4 dark:bg-transparent',
            )}
        >
            {properties.icon && (
                <div className="relative h-4 w-4">
                    <properties.icon className="h-full w-full" />
                </div>
            )}
            {properties.title}
        </Link>
    );
}
