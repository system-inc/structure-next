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

// Component - NavigationLink
export interface NavigationLinkProperties {
    className?: string;
    title: string;
    href: string;
    icon?: ButtonProperties['icon'];
    onClick: ButtonProperties['onClick'];
}
export function NavigationLink(properties: NavigationLinkProperties) {
    // Hooks
    const urlPath = useUrlPath();

    // Determine if this link is active
    const isActive = urlPath === properties.href || urlPath.startsWith(properties.href + '/');

    // Render the component
    return (
        <Button
            href={properties.href}
            className={mergeClassNames(
                buttonCommonLayoutClassNames,
                buttonCommonBehaviorClassNames,
                buttonCommonTypographyClassNames,
                buttonCommonFocusClassNames,
                'justify-start gap-2.5 rounded-xl px-3 py-2 font-medium hover:background--2 active:background--6!',
                isActive && 'background--4!',
                properties.className,
            )}
            iconLeft={properties.icon}
            onClick={properties.onClick}
        >
            {properties.title}
        </Button>
    );
}
