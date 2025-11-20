'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import { inputSelectTheme as structureInputSelectTheme } from './InputSelectTheme';
import type { InputSelectVariant, InputSelectSize } from './InputSelectTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - InputSelect
export interface InputSelectProperties extends Omit<React.ComponentPropsWithoutRef<'select'>, 'size'> {
    variant?: InputSelectVariant;
    size?: InputSelectSize;
}
export const InputSelect = React.forwardRef<HTMLSelectElement, InputSelectProperties>(function (
    { className, variant, size, children, ...selectProperties },
    reference,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge structure theme with project overrides
    const theme = mergeComponentTheme(structureInputSelectTheme, componentTheme?.InputSelect);

    // Apply default variant/size if not specified
    const finalVariant = variant ?? theme.configuration.defaultVariant?.variant;
    const finalSize = size ?? theme.configuration.defaultVariant?.size;

    // Build className from theme
    const themeClassName = mergeClassNames(
        finalVariant && theme.variants[finalVariant],
        finalSize && theme.sizes[finalSize],
        className,
    );

    // Render the component
    return (
        <select ref={reference} className={themeClassName} {...selectProperties}>
            {children}
        </select>
    );
});

// Set the display name on the component for debugging
InputSelect.displayName = 'InputSelect';
