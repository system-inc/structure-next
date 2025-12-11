'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import { inputTextTheme as structureInputTextTheme } from './InputTextTheme';
import { inputTextCommonIconContainerClassNames, inputTextCommonIconWrapperClassNames } from './InputTextTheme';
import type { InputTextVariant, InputTextSize } from './InputTextTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme, themeIcon } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Type - Icon
export type InputTextIconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ReactNode;

// Component - InputText
export interface InputTextProperties extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    variant?: InputTextVariant;
    size?: InputTextSize;
    iconLeft?: InputTextIconType;
    iconRight?: InputTextIconType;
    isClearable?: boolean;
    selectValueOnFocus?: boolean;
}
export const InputText = React.forwardRef<HTMLInputElement, InputTextProperties>(function (
    {
        className,
        variant,
        size,
        iconLeft,
        iconRight,
        isClearable,
        selectValueOnFocus,
        type,
        placeholder,
        autoComplete,
        spellCheck,
        ...inputProperties
    },
    reference,
) {
    // State - Track if input has value (for showing clear button)
    const [hasValue, setHasValue] = React.useState(
        inputProperties.defaultValue ? String(inputProperties.defaultValue).length > 0 : false,
    );

    // Refs - Internal ref for clearing
    const internalReference = React.useRef<HTMLInputElement>(null);
    const inputReference = (reference as React.RefObject<HTMLInputElement>) || internalReference;

    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge structure theme with project overrides
    const theme = mergeTheme(structureInputTextTheme, componentTheme?.InputText);

    // Apply default variant/size if not specified
    const finalVariant = variant ?? theme.configuration.defaultVariant?.variant;
    const finalSize = size ?? theme.configuration.defaultVariant?.size;

    // Get icon configuration for this size
    const iconConfiguration = finalSize ? theme.iconSizes?.[finalSize] : undefined;

    // Determine if we should show clear button
    const showClearButton = isClearable && hasValue;

    // Determine if we need icon wrapper (icons or clearable)
    const hasIcons = iconLeft || iconRight || isClearable;

    // Build className from theme (include icon padding when icons present)
    const themeClassName = mergeClassNames(
        finalVariant && theme.variants[finalVariant],
        finalSize && theme.sizes[finalSize],
        iconLeft && iconConfiguration?.inputPaddingLeft,
        (iconRight || isClearable) && iconConfiguration?.inputPaddingRight,
        className,
    );

    // Function to intercept input events and track if has value
    function onInputIntercept(event: React.FormEvent<HTMLInputElement>) {
        setHasValue(event.currentTarget.value.length > 0);
        inputProperties.onInput?.(event);
    }

    // Function to clear the input
    function clearValue() {
        if(inputReference.current) {
            inputReference.current.value = '';
            setHasValue(false);
            inputReference.current.focus();
        }
    }

    // Function to select all text on focus
    function onFocusIntercept(event: React.FocusEvent<HTMLInputElement>) {
        if(selectValueOnFocus) {
            event.currentTarget.select();
        }
        inputProperties.onFocus?.(event);
    }

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

    // Build the input element
    const inputElement = (
        <input
            ref={inputReference}
            className={themeClassName}
            type={finalType}
            placeholder={finalPlaceholder}
            autoComplete={finalAutoComplete}
            autoCapitalize={finalAutoCapitalize}
            spellCheck={finalSpellCheck}
            formNoValidate={true} // Disable native HTML5 validation, prefer our own
            onInput={isClearable ? onInputIntercept : undefined}
            onFocus={selectValueOnFocus ? onFocusIntercept : inputProperties.onFocus}
            {...inputProperties}
        />
    );

    // Return unwrapped if no icons (existing behavior, no breaking changes)
    if(!hasIcons) {
        return inputElement;
    }

    // Render with icon containers
    return (
        <div className={inputTextCommonIconWrapperClassNames}>
            {iconLeft && iconConfiguration && (
                <div
                    className={mergeClassNames(inputTextCommonIconContainerClassNames, iconConfiguration.containerLeft)}
                >
                    {themeIcon(iconLeft, iconConfiguration.icon)}
                </div>
            )}
            {inputElement}
            {/* Clear button - shown when isClearable and has value */}
            {showClearButton && iconConfiguration && (
                <Button
                    variant="Ghost"
                    size="Icon"
                    icon={<XIcon />}
                    onClick={clearValue}
                    aria-label="Clear input"
                    className={mergeClassNames(iconConfiguration.clearButton, iconConfiguration.containerRight)}
                />
            )}
            {/* Right icon - only show if not showing clear button */}
            {iconRight && !showClearButton && iconConfiguration && (
                <div
                    className={mergeClassNames(
                        inputTextCommonIconContainerClassNames,
                        iconConfiguration.containerRight,
                    )}
                >
                    {themeIcon(iconRight, iconConfiguration.icon)}
                </div>
            )}
        </div>
    );
});

// Set the display name on the component for debugging
InputText.displayName = 'InputText';
