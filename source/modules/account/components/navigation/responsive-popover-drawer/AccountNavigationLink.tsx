'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { ButtonProperties, Button } from '@structure/source/components/buttons/Button';
import {
    buttonCommonLayoutClassNames,
    buttonCommonBehaviorClassNames,
    buttonCommonTypographyClassNames,
    buttonCommonFocusClassNames,
} from '@structure/source/components/buttons/ButtonTheme';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - AccountNavigationLink
export interface AccountNavigationLinkProperties {
    className?: string;
    href: string;
    icon?: ButtonProperties['icon'];
    children?: React.ReactNode;
    onClick: ButtonProperties['onClick'];
}
export function AccountNavigationLink(properties: AccountNavigationLinkProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // Determine if this link is active (exact match or starts with href followed by /)
    const isActive =
        urlPath === properties.href || (urlPath.startsWith(properties.href + '/') && properties.href !== '/');

    // Render the component
    return (
        <Button
            href={properties.href}
            className={mergeClassNames(
                buttonCommonLayoutClassNames,
                buttonCommonBehaviorClassNames,
                buttonCommonTypographyClassNames,
                buttonCommonFocusClassNames,
                'justify-start gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium hover:background--3 active:background--5! dark:hover:background--4 dark:active:background--6!',
                isActive && 'background--4! dark:background--5!',
                properties.className,
            )}
            iconLeft={properties.icon}
            onClick={properties.onClick}
        >
            <div className="flex w-full items-center justify-between">{properties.children}</div>
        </Button>
    );
}
