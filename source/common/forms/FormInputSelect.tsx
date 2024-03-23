// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemInterface } from '@structure/source/common/interactions/MenuItem';
import {
    FormInputErrorInterface,
    FormInputReferenceInterface,
    FormInputInterface,
    FormInput,
} from '@structure/source/common/forms/FormInput';
import { InputSelectInterface, InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Class Names - InputSelect
export const inputSelectClassName =
    // Layout and sizing
    `w-full`;

// Component - FormInputSelect
export interface FormInputSelectInterface
    extends Omit<InputSelectInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    items: MenuItemInterface[];
    sibling?: React.ReactNode;
}
export const FormInputSelect = React.forwardRef<FormInputReferenceInterface, FormInputSelectInterface>(function (
    properties: FormInputSelectInterface,
    reference: React.Ref<FormInputReferenceInterface>,
) {
    // References
    const valueReference = React.useRef(properties.defaultValue); // Expose value to Form
    const inputSelectReference = React.useRef<FormInputReferenceInterface>(null);

    // Function to focus on the component
    const focus = React.useCallback(function () {
        inputSelectReference.current?.focus();
    }, []);

    // Function to handle form input value changes
    const onChangeIntercept = React.useCallback(
        function (value: string | undefined, event?: Event, skipOnChangeCallback: boolean = false) {
            // console.log('FormInputSelect.tsx Form input value changed:', value);

            // Update the value reference
            valueReference.current = value;

            // Set the value of the input select
            inputSelectReference.current?.setValue(value);

            // Run the provided form input onChange function if provided
            if(!skipOnChangeCallback && properties.onChange) {
                properties.onChange(value, event);
            }
        },
        [properties],
    );

    // Expose internal state to Form through the reference
    React.useImperativeHandle(reference, () => ({
        getValue: () => valueReference.current,
        setValue: (value: string | undefined, event?: Event) => {
            onChangeIntercept(value, event, true);
        },
        focus,
        // Expose a validate function to the Form component for form input validation
        // This will run in addition to the provided property.validate
        validate: async function (value?: string) {
            const errors: FormInputErrorInterface[] = [];
            return errors;
        },
    }));

    // Render the component
    return (
        <FormInput
            key="formInput"
            id={properties.id}
            className={mergeClassNames('', properties.className)}
            defaultValue={properties.defaultValue}
            label={properties.label}
            labelTip={properties.labelTip}
            description={properties.description}
            disabled={properties.disabled}
            required={properties.required}
            focus={focus}
            validate={properties.validate}
            validating={properties.validating}
            errors={properties.errors}
            component={
                <div className="relative">
                    <InputSelect
                        key={properties.loadingItems ? 'inputSelectLoading' : 'inputSelectLoaded'}
                        ref={inputSelectReference}
                        variant={properties.variant}
                        size={properties.size}
                        className={mergeClassNames(inputSelectClassName, properties.componentClassName)}
                        defaultValue={properties.defaultValue}
                        required={properties.required}
                        disabled={properties.disabled}
                        tabIndex={properties.tabIndex}
                        onChange={onChangeIntercept}
                        onBlur={properties.onBlur}
                        // Specific to InputSelect
                        placeholder={properties.placeholder}
                        items={properties.items}
                        loadingItems={properties.loadingItems}
                        loadingItemsMessage={properties.loadingItemsMessage}
                        loadingItemsError={properties.loadingItemsError}
                        search={properties.search}
                        allowNoSelection={properties.allowNoSelection}
                        buttonProperties={properties.buttonProperties}
                        popoverMenuProperties={properties.popoverMenuProperties}
                        popoverProperties={properties.popoverProperties}
                    />
                    {properties.sibling}
                </div>
            }
        />
    );
});

// Set the display name for debugging purposes
FormInputSelect.displayName = 'FormInputSelect';

// Export - Default
export default FormInputSelect;
