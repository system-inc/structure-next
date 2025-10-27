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
    { className, variant, size, type, placeholder, autoComplete, spellCheck, ...inputProperties },
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

    // Apply intelligent defaults based on type
    const finalType = type ?? 'text';
    let finalPlaceholder = placeholder;
    let finalAutoComplete = autoComplete;
    let finalSpellCheck = spellCheck;
    let finalAutoCapitalize = inputProperties.autoCapitalize;

    if(finalType === 'email') {
        finalPlaceholder = placeholder ?? 'email@domain.com';
        finalAutoComplete = autoComplete ?? 'email';
        finalSpellCheck = spellCheck ?? false;
        finalAutoCapitalize = inputProperties.autoCapitalize ?? 'none';
    }
    else if(finalType === 'password') {
        finalAutoComplete = autoComplete ?? 'current-password';
        finalSpellCheck = spellCheck ?? false;
        finalAutoCapitalize = inputProperties.autoCapitalize ?? 'none';
    }
    else if(finalType === 'tel') {
        finalAutoComplete = autoComplete ?? 'tel';
        finalSpellCheck = spellCheck ?? false;
        finalAutoCapitalize = inputProperties.autoCapitalize ?? 'none';
    }
    else if(finalType === 'url') {
        finalAutoComplete = autoComplete ?? 'url';
        finalSpellCheck = spellCheck ?? false;
        finalAutoCapitalize = inputProperties.autoCapitalize ?? 'none';
    }
    else if(finalType === 'search') {
        finalSpellCheck = spellCheck ?? true;
        finalAutoCapitalize = inputProperties.autoCapitalize ?? 'none';
    }
    else if(finalType === 'text') {
        finalSpellCheck = spellCheck ?? true;
    }

    // Render the component
    return (
        <input
            ref={reference}
            className={themeClassName}
            type={finalType}
            placeholder={finalPlaceholder}
            autoComplete={finalAutoComplete}
            autoCapitalize={finalAutoCapitalize}
            spellCheck={finalSpellCheck}
            {...inputProperties}
        />
    );
});

// Set the display name for the component
InputText.displayName = 'InputText';
