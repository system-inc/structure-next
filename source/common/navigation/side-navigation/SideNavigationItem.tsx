// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { SideNavigationSectionProperties } from '@structure/source/common/navigation/side-navigation/SideNavigationSection';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - SideNavigationItem
export interface SideNavigationItemProperties {
    title: React.ReactNode;
    href?: string;
    children?: SideNavigationSectionProperties[];
    isHeader?: boolean;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
export function SideNavigationItem(properties: SideNavigationItemProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // Components
    const Icon = properties.icon;

    // Render the component
    return (
        <Link
            href={properties.href || '#'}
            className={mergeClassNames(
                'group flex items-center gap-x-2 rounded-medium px-2 py-1 text-[13px] leading-6 hover:bg-light-2 dark:hover:bg-dark-3 dark:active:bg-dark-3',
                urlPath === properties.href
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
