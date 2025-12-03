'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';

// Dependencies - Theme
import { inputCheckboxTheme as structureInputCheckboxTheme } from './InputCheckboxTheme';
import type { InputCheckboxVariant, InputCheckboxSize } from './InputCheckboxTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import MinusIcon from '@structure/assets/icons/interface/MinusIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Type - InputCheckboxIndeterminateState
export type InputCheckboxIndeterminateState = 'Indeterminate';

// Type - InputCheckboxState (for type safety and consistency)
export type InputCheckboxState = boolean | InputCheckboxIndeterminateState;

// Component - InputCheckbox
export interface InputCheckboxProperties
    extends Omit<
        React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
        'asChild' | 'checked' | 'defaultChecked' | 'onCheckedChange'
    > {
    variant?: InputCheckboxVariant;
    size?: InputCheckboxSize;
    isChecked?: InputCheckboxState;
    defaultIsChecked?: InputCheckboxState;
    onIsCheckedChange?: (isChecked: InputCheckboxState) => void;
    children?: React.ReactNode; // Label text displayed next to the checkbox
    labelClassName?: string; // Additional classes for the label wrapper
}
export const InputCheckbox = React.forwardRef<React.ComponentRef<typeof RadixCheckbox.Root>, InputCheckboxProperties>(
    function InputCheckbox(
        {
            className,
            variant,
            size,
            isChecked,
            defaultIsChecked,
            onIsCheckedChange,
            children,
            labelClassName,
            ...radixCheckboxRootProperties
        },
        reference,
    ) {
        // Generate unique ID for label association
        const generatedId = React.useId();
        const checkboxId = radixCheckboxRootProperties.id ?? generatedId;

        // Get component theme from context
        const componentTheme = useComponentTheme();

        // Merge structure theme with project overrides
        const theme = mergeTheme(structureInputCheckboxTheme, componentTheme?.InputCheckbox);

        // Apply default variant/size if not specified
        const finalVariant = variant ?? theme.configuration.defaultVariant?.variant;
        const finalSize = size ?? theme.configuration.defaultVariant?.size;

        // Build className from theme
        const themeClassName = mergeClassNames(
            finalVariant && theme.variants[finalVariant],
            finalSize && theme.sizes[finalSize],
            className,
        );

        // Get icon size from theme
        const iconSizeClassName = finalSize ? theme.iconSizes[finalSize] : undefined;

        // Map our 'Indeterminate' to Radix's 'indeterminate'
        const radixIsChecked = isChecked === 'Indeterminate' ? ('indeterminate' as const) : isChecked;
        const radixDefaultIsChecked =
            defaultIsChecked === 'Indeterminate' ? ('indeterminate' as const) : defaultIsChecked;

        // Wrap onIsCheckedChange to map Radix's 'indeterminate' back to our 'Indeterminate'
        const handleCheckedChange = React.useCallback(
            function (checked: boolean | 'indeterminate') {
                if(onIsCheckedChange) {
                    const mappedChecked = checked === 'indeterminate' ? ('Indeterminate' as const) : checked;
                    onIsCheckedChange(mappedChecked);
                }
            },
            [onIsCheckedChange],
        );

        // Build the checkbox element
        const checkboxElement = (
            <RadixCheckbox.Root
                ref={reference}
                id={checkboxId}
                name={radixCheckboxRootProperties.name ?? checkboxId}
                className={themeClassName}
                checked={radixIsChecked}
                defaultChecked={radixDefaultIsChecked}
                onCheckedChange={handleCheckedChange}
                {...radixCheckboxRootProperties}
            >
                <RadixCheckbox.Indicator className={theme.configuration.indicatorClasses}>
                    {isChecked === 'Indeterminate' ? (
                        <MinusIcon className={iconSizeClassName} />
                    ) : (
                        <CheckIcon className={iconSizeClassName} />
                    )}
                </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>
        );

        // If children provided, wrap in a label for accessibility
        if(children) {
            return (
                <label
                    className={mergeClassNames(
                        'flex w-fit cursor-pointer items-center gap-2 text-sm select-none',
                        labelClassName,
                    )}
                    htmlFor={checkboxId}
                >
                    {checkboxElement}
                    {children}
                </label>
            );
        }

        // Otherwise, render just the checkbox
        return checkboxElement;
    },
);

// Set display name for debugging
InputCheckbox.displayName = 'InputCheckbox';
