'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - PostCommentControl
export interface PostCommentControlProperties {
    className?: string;
    children?: React.ReactNode;
    href?: string;
    onClick?: () => void;
}
export function PostCommentControl(properties: PostCommentControlProperties) {
    const Component = properties.href ? Link : 'div';

    // Render the component
    return (
        <Component
            tabIndex={0}
            className={mergeClassNames(
                // Layout
                'mr-0.5 flex cursor-pointer items-center space-x-1 px-2 py-1.5',
                // Border
                'rounded-lg border border-transparent',
                // Hover - Light
                'hover:border--3',
                // Hover - Dark
                'dark:hover:border-dark-3 dark:hover:bg-dark-2',
                // Active - Light
                'active:border--3',
                // Active - Dark
                'dark:active:border-dark-5 dark:active:bg-dark-3',
                // Popover Expanded - Light
                'group-aria-expanded:border--3',
                // Popover Expanded - Dark
                'dark:group-aria-expanded:border-dark-5 dark:group-aria-expanded:bg-dark-3',
                properties.className,
            )}
            href={properties.href as string}
            onClick={properties.onClick}
        >
            {properties.children}
        </Component>
    );
}
