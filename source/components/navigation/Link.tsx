'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// This is the only place these imports are valid
// eslint-disable-next-line structure/react-import-rule
import NextLink from 'next/link';
// eslint-disable-next-line structure/react-import-rule
import type { LinkProps as NextLinkProperties } from 'next/link';

// Dependencies - Theme
import { linkTheme as structureLinkTheme } from '@structure/source/components/navigation/LinkTheme';
import type { LinkVariant } from '@structure/source/components/navigation/LinkTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Link
export interface LinkProperties
    extends NextLinkProperties,
        Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProperties> {
    className?: string;
    children?: React.ReactNode;
    variant?: LinkVariant;
}
export const Link = React.forwardRef<HTMLAnchorElement, LinkProperties>(function (
    { variant, className, children, ...nextLinkProperties },
    reference,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const linkTheme = mergeTheme(structureLinkTheme, componentTheme?.Link);

    // Create link variant class names function using the merged theme
    const linkVariantClassNames = createVariantClassNames(linkTheme.configuration.baseClasses, {
        variants: {
            variant: linkTheme.variants,
        },
        defaultVariants: linkTheme.configuration.defaultVariant
            ? {
                  variant: linkTheme.configuration.defaultVariant,
              }
            : {},
    });

    // Get variant classes (unstyled if no variant specified)
    const variantClasses = linkVariantClassNames({
        variant: variant,
    });

    // Merge variant classes with user className, giving precedence to user classes
    const mergedClassName = mergeClassNames(variantClasses, className);

    // Render the component
    return (
        <NextLink {...nextLinkProperties} ref={reference} className={mergedClassName}>
            {children}
        </NextLink>
    );
});

// Set the display name on the component for debugging
Link.displayName = 'Link';
