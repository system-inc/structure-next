// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Account
import { AccountRole } from '@structure/source/modules/account/Account';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { useSetAtom } from 'jotai';
import { opsNavigationOpenAtom } from '../OpsNavigationBar';

// NavigationLink
export interface OpsNavigationLinkProperties {
    title: string;
    href: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    active?: boolean;
    links?: OpsNavigationLinkProperties[];
    // Roles that can access this navigation item. If empty/undefined, only Administrator can access
    accessibleRoles?: AccountRole[];
}
export function OpsNavigationLink(properties: OpsNavigationLinkProperties) {
    // console.log('OpsNavigationLink', properties.title, 'active', properties.active);
    const setOpsNavigationState = useSetAtom(opsNavigationOpenAtom);

    function handleClick() {
        setOpsNavigationState(false);
    }

    // Render the component
    return (
        <Link
            href={properties.href}
            className={mergeClassNames(
                'group flex items-center gap-x-2 rounded-md px-1.5 py-1 text-[13px] leading-6 hover:background--5 active:background--6 active:content--0',
                properties.active
                    ? // If the live is active
                      'background--4 content--0'
                    : // If the link is not active
                      'content--1',
            )}
            onClick={handleClick}
        >
            {properties.icon && (
                <div className="relative h-4 w-4">
                    <properties.icon className="h-full w-full" />
                </div>
            )}
            <p>{properties.title}</p>
        </Link>
    );
}
