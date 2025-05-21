// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// NavigationLink
export interface OpsNavigationLinkProperties {
    title: string;
    href: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    active?: boolean;
    links?: OpsNavigationLinkProperties[];
}
export function OpsNavigationLink(properties: OpsNavigationLinkProperties) {
    // console.log('OpsNavigationLink', properties.title, 'active', properties.active);

    // The icon component to use
    const Icon = properties.icon;

    // Render the component
    return (
        <Link
            href={properties.href}
            className={mergeClassNames(
                'group flex items-center gap-x-2 rounded-medium px-1.5 py-1 text-[13px] leading-6 hover:bg-light-3 dark:text-light-4 dark:hover:bg-dark-3 dark:active:bg-dark-3',
                properties.active
                    ? // If the live is active
                      'bg-light-2 text-dark dark:bg-dark-2 dark:text-light-4'
                    : // If the link is not active
                      '',
            )}
        >
            {Icon && (
                <div className="relative h-4 w-4">
                    <Icon className="h-full w-full" />
                </div>
            )}
            <p>{properties.title}</p>
        </Link>
    );
}

// Export - Default
export default OpsNavigationLink;
