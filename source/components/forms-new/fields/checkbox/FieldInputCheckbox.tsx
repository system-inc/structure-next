'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputCheckbox } from './InputCheckbox';
import { TipButton } from '@structure/source/components/buttons/TipButton';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Dependencies - Types
import type { InputCheckboxState } from './InputCheckbox';

// Component - FieldInputCheckbox
export type FieldInputCheckboxProperties = Omit<
    React.ComponentProps<typeof InputCheckbox>,
    'isChecked' | 'defaultIsChecked'
> & {
    children?: React.ReactNode; // Label text displayed next to the checkbox
    labelClassName?: string; // Additional classes for the label wrapper
    tip?: React.ReactNode; // Optional tooltip content displayed at the end of the label
};

export function FieldInputCheckbox(properties: FieldInputCheckboxProperties) {
    // Destructure label-related props
    const { children, labelClassName, tip, ...checkboxProperties } = properties;

    // Hooks
    const fieldContext = useFieldContext<boolean>();
    const fieldId = useFieldId(fieldContext.name);

    // Subscribe to value and errors for controlled input
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });
    const storeErrors = useStore(fieldContext.store, function (state) {
        return state.meta.errors;
    });

    // Function to handle checked change events
    function onIsCheckedChangeIntercept(isChecked: InputCheckboxState) {
        // Checkboxes always commit immediately on change (not on blur)
        const checkedValue = isChecked === 'Indeterminate' ? false : isChecked;
        fieldContext.handleChange(checkedValue);

        // Call properties.onIsCheckedChange if it exists
        checkboxProperties.onIsCheckedChange?.(isChecked);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLButtonElement>) {
        // Trigger validation on blur
        fieldContext.handleBlur();

        // Call properties.onBlur if it exists
        checkboxProperties.onBlur?.(event);
    }

    // Build the checkbox element
    const checkboxElement = (
        <InputCheckbox
            {...checkboxProperties}
            id={checkboxProperties.id ?? fieldId}
            name={checkboxProperties.name ?? fieldContext.name}
            isChecked={storeValue ?? false}
            aria-invalid={storeErrors && storeErrors.length > 0 ? true : undefined}
            onIsCheckedChange={onIsCheckedChangeIntercept}
            onBlur={onBlurIntercept}
        />
    );

    // If children provided, wrap in a label for accessibility
    if(children) {
        return (
            <label
                className={mergeClassNames(
                    'flex cursor-pointer items-center gap-2 text-sm select-none',
                    labelClassName,
                )}
                htmlFor={checkboxProperties.id ?? fieldId}
            >
                {checkboxElement}
                {tip ? (
                    <div className="flex items-center gap-0.5">
                        {children}
                        <TipButton tip={tip} tipClassName="text-sm font-normal" openOnPress={true} />
                    </div>
                ) : (
                    children
                )}
            </label>
        );
    }

    // Otherwise, render just the checkbox
    return checkboxElement;
}
