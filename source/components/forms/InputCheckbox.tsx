// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputProperties } from '@structure/source/components/forms/Input';
import { NonLinkButtonProperties, Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import CheckIcon from '@structure/assets/icons/status/CheckIcon.svg';
import MinusIcon from '@structure/assets/icons/interface/MinusIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// InputCheckbox - Variants
export const InputCheckboxVariants = {
    // Default variant
    default:
        // Layout and sizing
        ``,
};

// InputCheckbox - Sizes
export const InputCheckboxSizes = {
    default: '',
};

// Type - InputCheckboxState
export enum InputCheckboxState {
    Checked = 'Checked',
    Unchecked = 'Unchecked',
    Indeterminate = 'Indeterminate',
}

// Interface - InputCheckboxReference
export interface InputCheckboxReferenceInterface extends InputReferenceInterface {
    getValue: () => InputCheckboxState | undefined;
    setValue: (value?: InputCheckboxState, event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

// Component - InputCheckbox
export interface InputCheckboxProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: InputCheckboxState;

    // Events
    onChange?: (value: InputCheckboxState | undefined, event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onBlur?: (value: InputCheckboxState | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    variant?: keyof typeof InputCheckboxVariants;
    size?: keyof typeof InputCheckboxSizes;

    buttonProperties?: Omit<NonLinkButtonProperties, 'variant' | 'size' | 'onClick' | 'onBlur'>;
}
export const InputCheckbox = React.forwardRef<InputCheckboxReferenceInterface, InputCheckboxProperties>(function (
    properties: InputCheckboxProperties,
    reference: React.Ref<InputCheckboxReferenceInterface>,
) {
    // References
    const buttonReference = React.useRef<HTMLButtonElement>(null);

    // Defaults
    // const variant = properties.variant || 'default';
    // const size = properties.size || 'default';

    // State
    const [value, setValue] = React.useState<InputCheckboxState | undefined>(properties.defaultValue);

    // Function to expose methods to parent components
    React.useImperativeHandle(reference, function () {
        return {
            getValue: function () {
                return value;
            },
            setValue: function (value) {
                setValue(value);
            },
            focus: function () {
                // Call the focus method on the button's DOM element
                buttonReference.current?.focus();
            },
            click: function () {
                buttonReference.current?.click();
            },
        };
    });

    // Function to handle input value changes
    const propertiesOnChange = properties.onChange;
    const onChangeIntercept = React.useCallback(
        function (inputCheckBoxState: InputCheckboxState, event: React.MouseEvent<HTMLElement, MouseEvent>) {
            // console.log('InputCheckbox.tsx value changed:', inputCheckBoxState);
            const newInputCheckboxState = inputCheckBoxState;

            // If the value is not undefined
            if(newInputCheckboxState !== undefined) {
                // Set the new value
                setValue(newInputCheckboxState);
            }

            // Call the onChange callback if it exists
            if(propertiesOnChange) {
                propertiesOnChange(newInputCheckboxState, event);
            }
        },
        [propertiesOnChange],
    );

    // Function to handle blur events
    const propertiesOnBlur = properties.onBlur;
    const onBlurIntercept = React.useCallback(
        function (event: React.FocusEvent<HTMLButtonElement>) {
            // Run the provided form input onBlur function if provided
            if(propertiesOnBlur) {
                propertiesOnBlur(value, event);
            }
        },
        [propertiesOnBlur, value],
    );

    // Render the component
    const IconComponent =
        value === InputCheckboxState.Checked
            ? CheckIcon
            : value === InputCheckboxState.Indeterminate
              ? MinusIcon
              : null;

    return (
        <Button
            ref={buttonReference}
            className={mergeClassNames('', properties.className)}
            type="button" // Set this so forms does not submit on click
            variant="InputCheckbox"
            size="InputCheckbox"
            disabled={properties.disabled}
            tabIndex={properties.tabIndex ?? 1}
            data-state={
                value === InputCheckboxState.Checked
                    ? 'checked'
                    : value === InputCheckboxState.Indeterminate
                      ? 'indeterminate'
                      : 'unchecked'
            }
            icon={IconComponent}
            onBlur={onBlurIntercept}
            onClick={function (event) {
                onChangeIntercept(
                    value === InputCheckboxState.Checked ? InputCheckboxState.Unchecked : InputCheckboxState.Checked,
                    event,
                );
            }}
        />
    );
});

// Set the display name for the component for debugging
InputCheckbox.displayName = 'InputCheckbox';
