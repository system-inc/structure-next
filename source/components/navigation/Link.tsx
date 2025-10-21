'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import NextLink from 'next/link';
import type { LinkProps as NextLinkProperties } from 'next/link';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Link
export interface LinkProperties
    extends NextLinkProperties,
        Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProperties> {
    className?: string;
    children?: React.ReactNode;
    variant?: 'A' | 'B' | 'C' | 'Unstyled';
}
export const Link = React.forwardRef<HTMLAnchorElement, LinkProperties>(function (properties, reference) {
    // Determine base classes based on variant
    const baseClasses = React.useMemo(
        function () {
            switch(properties.variant) {
                case 'Unstyled':
                    return '';
                case 'B':
                    return 'link--b';
                case 'C':
                    return 'link--c';
                case 'A':
                default:
                    return 'link--a';
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
