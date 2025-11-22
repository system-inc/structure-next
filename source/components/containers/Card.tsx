// Dependencies - React
import React from 'react';

// Dependencies - Theme
import { cardTheme as structureCardTheme } from './CardTheme';
import type { CardVariant, CardSize } from './CardTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Card
export interface CardProperties extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    variant?: CardVariant;
    size?: CardSize;
    children?: React.ReactNode;
}
export const Card = React.forwardRef<HTMLDivElement, CardProperties>(function Card(
    { className, variant, size, children, ...divProperties }: CardProperties,
    reference,
) {
    // Hooks
    const componentTheme = useComponentTheme();

    // Merge structure theme with project theme
    const cardTheme = mergeComponentTheme(structureCardTheme, componentTheme?.Card);

    // Create variant className function
    const cardVariantClassNames = createVariantClassNames(cardTheme.configuration.baseClasses, {
        variants: {
            variant: cardTheme.variants,
            size: cardTheme.sizes,
        },
        defaultVariants: variant ? cardTheme.configuration.defaultVariant : {},
    });

    // Compute final className
    const computedClassName = mergeClassNames(
        cardVariantClassNames({
            variant: variant,
            size: size,
        }),
        className,
    );

    // Render the component
    return (
        <div ref={reference} {...divProperties} className={computedClassName}>
            {children}
        </div>
    );
});

// Set the display name on the component for debugging
Card.displayName = 'Card';
