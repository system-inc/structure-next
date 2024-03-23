// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormInputErrorInterface, FormInputInterface, FormInput } from '@structure/source/common/forms/FormInput';
import { TimeRangeType } from '@structure/source/common/forms/time/TimeRange';
import {
    InputTimeRangeReferenceInterface,
    InputTimeRangeInterface,
    InputTimeRange,
} from '@structure/source/common/forms/InputTimeRange';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - FormInputTimeRange
export interface FormInputTimeRangeInterface
    extends Omit<InputTimeRangeInterface, 'validate'>,
        Omit<FormInputInterface, 'component' | 'defaultValue' | 'onChange' | 'onBlur'> {
    sibling?: React.ReactNode;
}
export const FormInputTimeRange = React.forwardRef<InputTimeRangeReferenceInterface, FormInputTimeRangeInterface>(
    function (properties: FormInputTimeRangeInterface, reference: React.Ref<InputTimeRangeReferenceInterface>) {
        // References
        const valueReference = React.useRef<TimeRangeType | undefined>(properties.defaultValue); // For managing the value internally and exposing it to a form
        const inputTimeRangeReference = React.useRef<InputTimeRangeReferenceInterface>(null);

        // Function to focus on the component
        const focus = React.useCallback(function () {
            console.log('focusing!');
            inputTimeRangeReference.current?.focus();
        }, []);

        // Function to handle value changes and propagate them upwards through the form
        const onChangeIntercept = React.useCallback(
            function (value: TimeRangeType | undefined, skipOnChangeCallback: boolean = false) {
                // Update the value reference
                valueReference.current = value;

                // Set the value of the input time range
                inputTimeRangeReference.current?.setValue(value);

                // Run the provided form input onChange function if provided
                if(!skipOnChangeCallback && properties.onChange) {
                    properties.onChange(value);
                }
            },
            [properties],
        );

        // Expose internal state to Form through the reference
        React.useImperativeHandle(reference, () => ({
            getValue: () => valueReference.current,
            setValue: (value: TimeRangeType | undefined) => {
                onChangeIntercept(value, true); // Skip the onChange callback
            },
            focus,
            // Expose a validate function to the Form component for form input validation
            // This will run in addition to the provided property.validate
            validate: async function (value?: TimeRangeType) {
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
                        <InputTimeRange
                            key="inputTimeRangeLoaded"
                            ref={inputTimeRangeReference}
                            className={mergeClassNames('', properties.componentClassName)}
                            defaultValue={properties.defaultValue}
                            required={properties.required}
                            disabled={properties.disabled}
                            tabIndex={properties.tabIndex}
                            onChange={onChangeIntercept}
                            onBlur={properties.onBlur}
                            // Specific to InputTimeRange
                            placeholder={properties.placeholder}
                            showTimeRangePresets={properties.showTimeRangePresets}
                            buttonProperties={properties.buttonProperties}
                            popoverProperties={properties.popoverProperties}
                        />
                        {properties.sibling}
                    </div>
                }
            />
        );
    },
);

// Set the display name for debugging purposes
FormInputTimeRange.displayName = 'FormInputTimeRange';

// Export - Default
export default FormInputTimeRange;
