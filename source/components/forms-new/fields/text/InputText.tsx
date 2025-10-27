'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import { inputTextTheme as structureInputTextTheme } from './InputTextTheme';
import type { InputTextVariant, InputTextSize } from './InputTextTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - InputText
export interface InputTextProperties extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    variant?: InputTextVariant;
    size?: InputTextSize;
}
export const InputText = React.forwardRef<HTMLInputElement, InputTextProperties>(function (
    { className, variant, size, ...inputProperties },
    reference,
) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge structure theme with project overrides
    const theme = mergeComponentTheme(structureInputTextTheme, componentTheme?.InputText);

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
    return <input ref={reference} className={themeClassName} {...inputProperties} />;
});

// Set the display name for the component
InputText.displayName = 'InputText';
