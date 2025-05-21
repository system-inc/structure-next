'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import NextLink from 'next/link';
import type { LinkProps as NextLinkInterface } from 'next/link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Link
export interface LinkProperties
    extends NextLinkInterface,
        Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkInterface> {
    className?: string;
    children?: React.ReactNode;
    variant?: 'Primary' | 'Secondary' | 'Muted';
}
export const Link = React.forwardRef<HTMLAnchorElement, LinkProperties>(function (properties, reference) {
    // Determine base classes based on variant
    const baseClasses = React.useMemo(
        function () {
            switch(properties.variant) {
                case 'Secondary':
                    return 'link-secondary';
                case 'Muted':
                    return 'link-muted';
                case 'Primary':
                default:
                    return 'link-primary';
            }
        },
        [properties.variant],
    );

    // Merge user classes with our base classes, giving precedence to user classes
    const className = mergeClassNames(baseClasses, properties.className);

    // Render the component
    return (
        <NextLink {...properties} className={className} ref={reference}>
            {properties.children}
        </NextLink>
    );
});

// Set the display name for the component for debugging
Link.displayName = 'Link';
