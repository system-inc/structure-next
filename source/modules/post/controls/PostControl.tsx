'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - PostControl
export interface PostControlInterface {
    className?: string;
    children?: React.ReactNode;
    href?: string;
    onClick?: () => void;
}
export function PostControl(properties: PostControlInterface) {
    const Component = properties.href ? Link : 'div';

    // Render the component
    return (
        <Component
            tabIndex={0}
            className={mergeClassNames(
                // Layout
                'mr-0.5 flex cursor-pointer items-center space-x-1 px-2 py-1.5 ' +
                    // Border
                    'rounded-lg border border-transparent ' +
                    // Animation
                    'transition-colors ' +
                    // Hover - Light
                    'hover:border-light-3 ' +
                    // Hover - Dark
                    'dark:hover:border-dark-3 dark:hover:bg-dark-2 ' +
                    // Active - Light
                    'active:border-light-6 ' +
                    // Active - Dark
                    'dark:active:border-dark-5 dark:active:bg-dark-3 ' +
                    // Popover Expanded - Light
                    'group-aria-expanded:border-light-6 ' +
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

// Export - Default
export default PostControl;
