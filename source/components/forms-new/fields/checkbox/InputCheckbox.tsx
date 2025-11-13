'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';

// Dependencies - Theme
import { inputCheckboxTheme as structureInputCheckboxTheme } from './InputCheckboxTheme';
import type { InputCheckboxVariant, InputCheckboxSize } from './InputCheckboxTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

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
}
export const InputCheckbox = React.forwardRef<React.ComponentRef<typeof RadixCheckbox.Root>, InputCheckboxProperties>(
    function InputCheckbox(
        { className, variant, size, isChecked, defaultIsChecked, onIsCheckedChange, ...checkboxProperties },
        reference,
    ) {
        // Get component theme from context
        const componentTheme = useComponentTheme();

        // Merge structure theme with project overrides
        const theme = mergeComponentTheme(structureInputCheckboxTheme, componentTheme?.InputCheckbox);

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

        // Render the component
        return (
            <RadixCheckbox.Root
                ref={reference}
                className={themeClassName}
                checked={radixIsChecked}
                defaultChecked={radixDefaultIsChecked}
                onCheckedChange={handleCheckedChange}
                {...checkboxProperties}
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
    },
);

// Set display name for debugging
InputCheckbox.displayName = 'InputCheckbox';
