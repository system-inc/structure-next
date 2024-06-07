// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { MenuItemInterface } from '@structure/source/common/menus/MenuItem';
import { FormInputReferenceInterface, FormInputInterface, FormInput } from '@structure/source/common/forms/FormInput';
import { ValidationResult, mergeValidationResults } from '@structure/source/utilities/validation/Validation';
import { InputSelectInterface, InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

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
    // State
    const [validationResult, setValidationResult] = React.useState<ValidationResult | undefined>(
        properties.validationResult,
    );

    // References
    const valueReference = React.useRef(properties.defaultValue); // Expose value to Form
    const inputSelectReference = React.useRef<FormInputReferenceInterface>(null);

    // Function to focus on the component
    const focus = React.useCallback(function () {
        inputSelectReference.current?.focus();
    }, []);

    // Function to validate the component
    const propertiesValidate = properties.validate;
    const propertiesValidationSchema = properties.validationSchema;
    const propertiesOnValidate = properties.onValidate;
    const validate = React.useCallback(
        async function (value?: string) {
            // Run the validation schema validation if provided
            const validationSchemaValidationResult = propertiesValidationSchema
                ? await propertiesValidationSchema.validate(value)
                : undefined;

            // Run the provided validate function if provided
            const propertiesValidationResult = propertiesValidate ? await propertiesValidate(value) : undefined;

            // Merge the validation results
            const mergedValidationResult = mergeValidationResults(
                validationSchemaValidationResult,
                propertiesValidationResult,
            );

            // Set the validation result
            setValidationResult(mergedValidationResult);

            // Optionally run the onValidate function from properties if provided
            if(propertiesOnValidate) {
                propertiesOnValidate(mergedValidationResult);
            }

            return mergedValidationResult;
        },
        [propertiesValidationSchema, propertiesValidate, propertiesOnValidate],
    );

    // Function to handle form input value changes
    const propertiesOnChange = properties.onChange;
    const propertiesValidateOnChange = properties.validateOnChange;
    const onChangeIntercept = React.useCallback(
        function (value: string | undefined, event?: Event, skipOnChangeCallback: boolean = false) {
            // console.log('FormInputSelect.tsx Form input value changed:', value);

            // Update the value reference
            valueReference.current = value;

            // Set the value of the input select
            inputSelectReference.current?.setValue(value);

            // Optionally run the provided onChange function if provided
            if(!skipOnChangeCallback && propertiesOnChange) {
                propertiesOnChange(value, event);
            }

            // Optionally run validation if a properties.validateOnChange is true
            if(propertiesValidateOnChange) {
                validate(value);
            }
        },
        [propertiesOnChange, propertiesValidateOnChange, validate],
    );

    // Expose internal state to Form through the reference
    React.useImperativeHandle(reference, function () {
        return {
            getValue: function () {
                return valueReference.current;
            },
            setValue: function (value: string | undefined, event?: Event) {
                onChangeIntercept(value, event, true);
            },
            focus: focus,
            validate: validate,
        };
    });

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
            validationResult={validationResult}
            component={
                <div className="relative">
                    <InputSelect
                        key={properties.loadingItems ? 'inputSelectLoading' : 'inputSelectLoaded'}
                        ref={inputSelectReference}
                        variant={properties.variant}
                        size={properties.size}
                        className={mergeClassNames('w-full', properties.componentClassName)}
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
