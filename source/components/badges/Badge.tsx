'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Structure
import { badgeTheme as structureBadgeTheme } from '@structure/source/components/badges/BadgeTheme';
import type { BadgeVariant, BadgeKind, BadgeSize } from '@structure/source/components/badges/BadgeTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Type - Icon can be either a component reference or pre-rendered JSX
export type BadgeIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Component - Badge
export interface BadgeProperties extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    kind?: BadgeKind;
    size?: BadgeSize;
    icon?: BadgeIconType; // Icon to display before children
    iconClassName?: string; // Custom className for the icon
    className?: string;
    children?: React.ReactNode;
}
export const Badge = React.forwardRef<HTMLDivElement, BadgeProperties>(function Badge(
    {
        variant: variantProperty,
        kind: kindProperty,
        size: sizeProperty,
        icon,
        iconClassName,
        className,
        children,
        ...divProperties
    },
    reference,
) {
    // Get theme from context and merge with structure theme
    const componentTheme = useComponentTheme();
    const badgeTheme = mergeTheme(structureBadgeTheme, componentTheme?.Badge);

    // Apply defaults from theme configuration
    const variant = variantProperty || badgeTheme.configuration.defaultVariant.variant;
    const kind = kindProperty || badgeTheme.configuration.defaultVariant.kind;
    const size = sizeProperty || badgeTheme.configuration.defaultVariant.size;

    // Create variant class names from theme
    const badgeVariantClassNames = createVariantClassNames(badgeTheme.configuration.baseClassNames, {
        variants: {
            variant: badgeTheme.variants,
            kind: badgeTheme.kinds,
            size: badgeTheme.sizes,
        },
        compoundVariants: badgeTheme.compoundVariants,
        defaultVariants: badgeTheme.configuration.defaultVariant,
    });

    // Apply variant classes
    const computedClassName = mergeClassNames(
        badgeVariantClassNames({
            variant: variant,
            kind: kind,
            size: size,
        }),
        className, // User overrides last
    );

    // Render icon if provided, or status dot if kind is Status
    const renderedIcon = icon ? (
        themeIcon(icon, iconClassName)
    ) : kind === 'Status' ? (
        <div data-dot="true" className="size-1.5 shrink-0 rounded-full" />
    ) : null;

    return (
        <div ref={reference} className={computedClassName} {...divProperties}>
            {renderedIcon}
            {children}
        </div>
    );
});
Badge.displayName = 'Badge';
