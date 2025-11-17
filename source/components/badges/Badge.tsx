// Dependencies - React
import React from 'react';

// Dependencies - Structure
import { badgeTheme as structureBadgeTheme } from '@structure/source/components/badges/BadgeTheme';
import type { BadgeVariant, BadgeType, BadgeSize } from '@structure/source/components/badges/BadgeTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Type - Icon can be either a component reference or pre-rendered JSX
export type BadgeIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Component - Badge
export interface BadgeProperties extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
    type?: BadgeType;
    size?: BadgeSize;
    icon?: BadgeIconType; // Icon to display before children
    iconClassName?: string; // Custom className for the icon
    className?: string;
    children?: React.ReactNode;
}
export const Badge = React.forwardRef<HTMLDivElement, BadgeProperties>(function Badge(
    { variant: variantProperty, type: typeProperty, size: sizeProperty, icon, iconClassName, className, children, ...divProperties },
    reference,
) {
    // Get theme from context and merge with structure theme
    const componentTheme = useComponentTheme();
    const badgeTheme = mergeComponentTheme(structureBadgeTheme, componentTheme?.Badge);

    // Apply defaults from theme configuration
    const variant = variantProperty || badgeTheme.configuration.defaultVariant.variant;
    const type = typeProperty || badgeTheme.configuration.defaultVariant.type;
    const size = sizeProperty || badgeTheme.configuration.defaultVariant.size;

    // Create variant class names from theme
    const badgeVariantClassNames = createVariantClassNames(badgeTheme.configuration.baseClasses, {
        variants: {
            variant: badgeTheme.variants,
            type: badgeTheme.types,
            size: badgeTheme.sizes,
        },
        compoundVariants: badgeTheme.compoundVariants,
        defaultVariants: badgeTheme.configuration.defaultVariant,
    });

    // Apply variant classes
    const computedClassName = mergeClassNames(
        badgeVariantClassNames({
            variant: variant,
            type: type,
            size: size,
        }),
        className, // User overrides last
    );

    // Render icon if provided, or status dot if type is Status
    const renderedIcon = icon ? themeIcon(icon, iconClassName) : type === 'Status' ? (
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
