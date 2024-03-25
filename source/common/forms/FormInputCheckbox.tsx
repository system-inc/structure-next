// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputErrorInterface, FormInputInterface, FormInput } from '@structure/source/common/forms/FormInput';
import {
    InputCheckboxState,
    InputCheckboxReferenceInterface,
    InputCheckboxInterface,
    InputCheckbox,
} from '@structure/source/common/forms/InputCheckbox';
import TipIcon from '@structure/source/common/popovers/TipIcon';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - FormInputCheckbox
export interface FormInputCheckboxInterface
    extends Omit<InputCheckboxInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    sibling?: React.ReactNode;
}
export const FormInputCheckbox = React.forwardRef<InputCheckboxReferenceInterface, FormInputCheckboxInterface>(
    function (properties: FormInputCheckboxInterface, reference: React.Ref<InputCheckboxReferenceInterface>) {
        // References
        const valueReference = React.useRef(properties.defaultValue); // Expose value to Form
        const inputCheckboxReference = React.useRef<InputCheckboxReferenceInterface>(null);

        // Function to focus on the component
        const focus = React.useCallback(function () {
            inputCheckboxReference.current?.focus();
        }, []);

        // Function to click the button
        const click = React.useCallback(function () {
            inputCheckboxReference.current?.click();
        }, []);

        // Function to handle form input value changes
        const onChangeIntercept = React.useCallback(
            function (value: InputCheckboxState | undefined, event?: Event, skipOnChangeCallback: boolean = false) {
                // console.log('FormInputCheckbox.tsx Form input value changed:', value);

                // Update the value reference
                valueReference.current = value;

                // Set the value of the input select
                inputCheckboxReference.current?.setValue(value);

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
            setValue: (value: InputCheckboxState | undefined, event?: Event) => {
                onChangeIntercept(value, event, true);
            },
            focus,
            click,
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
                // label={properties.label} // Label rendered below
                // labelTip={properties.labelTip} // Label tip rendered below
                description={properties.description}
                disabled={properties.disabled}
                required={properties.required}
                focus={focus}
                validate={properties.validate}
                validating={properties.validating}
                errors={properties.errors}
                component={
                    <div className="relative flex items-center">
                        {/* Input Checkbox */}
                        <InputCheckbox
                            ref={inputCheckboxReference}
                            variant={properties.variant}
                            size={properties.size}
                            className={mergeClassNames('', properties.componentClassName)}
                            defaultValue={properties.defaultValue}
                            required={properties.required}
                            disabled={properties.disabled}
                            tabIndex={properties.tabIndex}
                            onChange={onChangeIntercept}
                            onBlur={properties.onBlur}
                            // Specific to InputCheckbox
                            buttonProperties={properties.buttonProperties}
                        />
                        {/* Label - Rendered here as a special case for checkboxes instead of in FormInput */}
                        <label
                            className="ml-2 cursor-pointer select-none text-sm font-medium"
                            onClick={function () {
                                click();

                                // TODO: There is a bug here where if you set the value directly,
                                // the form validation fails when the form is submitted. It shows
                                // the value as undefined. However, if you click the checkbox, the
                                // value is set correctly.

                                // Toggle the checkbox value
                                // let currentValue = inputCheckboxReference.current?.getValue();
                                // let newValue =
                                //     currentValue === InputCheckboxState.Checked
                                //         ? InputCheckboxState.Unchecked
                                //         : InputCheckboxState.Checked;
                                // inputCheckboxReference.current?.setValue(newValue);
                            }}
                        >
                            {properties.label}
                        </label>
                        {/* Label Tip - Rendered here as a special case for checkboxes instead of in FormInput */}
                        {properties.label && properties.labelTip && (
                            <TipIcon content={properties.labelTip} className="ml-1 max-w-xs" openOnPress />
                        )}
                        {properties.sibling}
                    </div>
                }
            />
        );
    },
);

// Set the display name for debugging purposes
FormInputCheckbox.displayName = 'FormInputCheckbox';

// Export - Default
export default FormInputCheckbox;
