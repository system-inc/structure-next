// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { SideNavigationSectionProperties } from '@structure/source/components/navigation/side-navigation/SideNavigationSection';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

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

    // Render the component
    return (
        <Link
            href={properties.href || '#'}
            className={mergeClassNames(
                'group hover:bg-light-2 dark:hover:bg-dark-3 dark:active:bg-dark-3 flex items-center gap-x-2 rounded-md px-2 py-1 text-[13px] leading-6',
                urlPath === properties.href
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
