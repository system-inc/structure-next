// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputProperties } from '@structure/source/common/forms/Input';

// Dependencies - Styles
// import { useTheme } from '@structure/source/theme/ThemeProvider';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Classes - InputTextArea

// Common input text area styles
export const commonClassNames =
    // Text
    `text-dark dark:text-light ` +
    // Placeholder
    `placeholder:opacity-70 dark:placeholder:opacity-70 ` +
    // Placeholder (disabled)
    `disabled:placeholder:opacity-20 disabled:dark:placeholder:opacity-20 ` +
    // Disabled
    `disabled:cursor-not-allowed disabled:text-opacity-20 disabled:dark:text-opacity-20`;

// Background styles
export const backgroundClassNames =
    // Background
    `bg-light dark:bg-dark+2`;

// Border styles
export const borderStyleClassNames =
    // Border
    `rounded-small border border-light-6 dark:border-dark-4 ` +
    // Focus
    `focus:border-neutral dark:focus:border-neutral-3`;

// Focus styles: background and text color changes on hover
export const focusStyleClassNames =
    // Focus
    `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`;

// Autofill styles
export const autofillStyleClassNames = `autofill:bg-transparent dark:autofill:bg-transparent`;

// InputTextArea - Variants
export const InputTextAreaVariants = {
    // Default variant: standard dark background and text color
    default:
        `${commonClassNames} ${backgroundClassNames} ${borderStyleClassNames} ${focusStyleClassNames} ${autofillStyleClassNames} ` +
        // Layout and sizing
        `px-3 py-2`,
    search:
        `${commonClassNames} ${backgroundClassNames} ${borderStyleClassNames} ${focusStyleClassNames} ${autofillStyleClassNames} ` +
        // Focus
        `focus-visible:outline-none focus-visible:ring-0 ` +
        // Layout and sizing
        `pl-9 pr-4 py-2 ` +
        // Border
        `border ` +
        // Background
        `bg-transparent`,
    menuSearch:
        `${commonClassNames} ${autofillStyleClassNames} ` +
        // Focus
        `focus-visible:outline-none focus-visible:ring-0 ` +
        // Layout and sizing
        `w-full pl-9 pr-4 py-3 ` +
        // Border
        `border-b ` +
        // Background
        `bg-transparent`,
};

// InputTextArea - Sizes
export const InputTextAreaSizes = {
    default: 'text-sm',
};

// Component - InputTextArea
export interface InputTextAreaProperties extends Omit<InputProperties, 'onChange' | 'onBlur'> {
    containerClassName?: string;

    // <textarea /> tag properties
    id: string;
    placeholder?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['placeholder'];
    autoComplete?: React.TextareaHTMLAttributes<HTMLTextAreaElement>['autoComplete'];
    selectOnFocus?: boolean;
    rows?: number;

    // Events
    onClick?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (value: string | undefined, event: React.FocusEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onChange?: (value: string | undefined, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;

    // Component properties
    variant?: keyof typeof InputTextAreaVariants;
    size?: keyof typeof InputTextAreaSizes;
}
export const InputTextArea = React.forwardRef<InputReferenceInterface, InputTextAreaProperties>(function (
    properties: InputTextAreaProperties,
    reference: React.Ref<InputReferenceInterface>,
) {
    // Hooks
    // const { themeClassName } = useTheme();

    // References
    const inputReference = React.useRef<HTMLTextAreaElement>(null);

    // Defaults
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';

    // Function to expose methods to parent components
    React.useImperativeHandle(reference, function () {
        return {
            getValue: function () {
                return inputReference.current?.value ?? undefined;
            },
            setValue: function (value) {
                if(inputReference.current) {
                    if(value === undefined) {
                        value = '';
                    }

                    inputReference.current.value = value;
                }
            },
            focus: function () {
                if(inputReference.current) {
                    inputReference.current.focus(); // Call the focus method on the input's DOM element
                }
            },
        };
    });

    // Function to handle input value changes
    const propertiesOnChange = properties.onChange;
    const onChangeIntercept = React.useCallback(
        function (event: React.ChangeEvent<HTMLTextAreaElement>) {
            // Run the provided form input onChange function if provided
            if(propertiesOnChange) {
                propertiesOnChange(event.target.value, event);
            }
        },
        [propertiesOnChange],
    );

    // Function to handle blur events
    const propertiesOnBlur = properties.onBlur;
    const onBlurIntercept = React.useCallback(
        function (event: React.FocusEvent<HTMLTextAreaElement>) {
            // Run the provided form input onBlur function if provided
            if(propertiesOnBlur) {
                propertiesOnBlur(event.target.value, event);
            }
        },
        [propertiesOnBlur],
    );

    // Function to handle focus events
    const propertiesOnFocus = properties.onFocus;
    const propertiesSelectOnFocus = properties.selectOnFocus;
    const onFocusIntercept = React.useCallback(
        function (event: React.FocusEvent<HTMLTextAreaElement>) {
            if(propertiesSelectOnFocus) {
                event.target.select();
            }

            // Run the provided form input onFocus function if provided
            if(propertiesOnFocus) {
                propertiesOnFocus(event);
            }
        },
        [propertiesOnFocus, propertiesSelectOnFocus],
    );

    // Render the component
    return (
        <div className={mergeClassNames('relative', properties.containerClassName)}>
            <textarea
                ref={inputReference}
                // key={themeClassName} // Force the component to re-render when the theme changes, so that the autofill color is correct
                className={mergeClassNames(
                    InputTextAreaVariants[variant],
                    InputTextAreaSizes[size],
                    properties.className,
                )}
                defaultValue={properties.defaultValue}
                placeholder={properties.placeholder}
                autoComplete={properties.autoComplete}
                required={properties.required}
                disabled={properties.disabled}
                tabIndex={properties.tabIndex}
                rows={properties.rows}
                onClick={properties.onClick}
                onFocus={onFocusIntercept}
                onBlur={onBlurIntercept}
                onKeyDown={properties.onKeyDown}
                onKeyUp={properties.onKeyUp}
                onChange={onChangeIntercept}
            />
        </div>
    );
});

// Set the display name for the component for debugging
InputTextArea.displayName = 'InputTextArea';
