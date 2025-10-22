'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputProperties } from '@structure/source/components/forms/Input';

// Dependencies - Styles
// import { useTheme } from '@structure/source/theme/ThemeProvider';

// Dependencies - Assets
import SearchIcon from '@structure/assets/icons/navigation/SearchIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Classes - InputText

// Common input styles
export const commonInputTextClassNames = mergeClassNames(
    // Text
    'content--a',
    // Placeholder
    'placeholder:opacity-70 dark:placeholder:opacity-70',
    // Placeholder (disabled)
    'disabled:placeholder:opacity-20 disabled:dark:placeholder:opacity-20',
    // Disabled
    'disabled:text-opacity-20 disabled:dark:text-opacity-20 disabled:cursor-not-allowed',
);

// Background styles
export const backgroundStyleClassNames = mergeClassNames(
    // Background
    'background--a',
);

// Border styles
export const borderStyleClassNames = mergeClassNames(
    // Border
    'rounded-lg border border--d',
    // Focus
    'focus:border-neutral dark:focus:border-neutral-3',
);

// Focus styles: background and text color changes on hover
export const focusStyleClassNames = mergeClassNames(
    // Focus
    'focus:border-neutral dark:focus:border-light focus-visible:ring-0 focus-visible:outline-none',
);

// Autofill styles
export const autofillStyleClassNames = mergeClassNames('autofill:bg-transparent dark:autofill:bg-transparent');

// InputText - Variants
export const InputTextVariants = {
    // Default variant: standard dark background and text color
    default: mergeClassNames(
        commonInputTextClassNames,
        backgroundStyleClassNames,
        borderStyleClassNames,
        focusStyleClassNames,
        autofillStyleClassNames,
        // Layout and sizing
        'h-9 px-3',
    ),
    search: mergeClassNames(
        commonInputTextClassNames,
        backgroundStyleClassNames,
        borderStyleClassNames,
        focusStyleClassNames,
        autofillStyleClassNames,
        // Focus
        'focus-visible:ring-0 focus-visible:outline-none',
        // Layout and sizing
        'h-9 pr-4 pl-9',
        // Border
        'border',
        // Background
        'bg-transparent',
    ),
    menuSearch: mergeClassNames(
        commonInputTextClassNames,
        autofillStyleClassNames,
        // Focus
        'focus-visible:ring-0 focus-visible:outline-none',
        // Layout and sizing
        'w-full py-3 pr-4 pl-9',
        // Border
        'border-b border--a',
        // Background
        'bg-transparent',
    ),
};

// InputText - Sizes
export const InputTextSizes = {
    default: 'text-sm',
    large: 'text-base h-10',
};

// Component - InputText
export interface InputTextProperties extends Omit<InputProperties, 'onChange' | 'onBlur'> {
    containerClassName?: string;

    // <input /> tag properties
    id: string;
    type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
    autoComplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    selectOnFocus?: boolean;

    // Events
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (value: string | undefined, event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange?: (value: string | undefined, event?: React.ChangeEvent<HTMLInputElement>) => void;

    // Component properties
    variant?: keyof typeof InputTextVariants;
    size?: keyof typeof InputTextSizes;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}
export const InputText = React.forwardRef<InputReferenceInterface, InputTextProperties>(function (
    properties: InputTextProperties,
    reference: React.Ref<InputReferenceInterface>,
) {
    // Hooks
    // const { themeClassName } = useTheme();

    // References
    const inputReference = React.useRef<HTMLInputElement>(null);

    // Defaults
    const type = properties.type ?? 'text';
    const variant = properties.variant || 'default';
    const size = properties.size || 'default';
    const Icon = properties.icon || variant == 'search' || variant == 'menuSearch' ? SearchIcon : undefined;

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
                inputReference.current?.focus(); // Call the focus method on the input's DOM element
            },
        };
    });

    // Function to handle input value changes
    const propertiesOnChange = properties.onChange;
    const onChangeIntercept = React.useCallback(
        function (event: React.ChangeEvent<HTMLInputElement>) {
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
        function (event: React.FocusEvent<HTMLInputElement>) {
            // console.log('event', event);

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
        function (event: React.FocusEvent<HTMLInputElement>) {
            if(propertiesSelectOnFocus) {
                event.target.select();
            }

            // Run the provided form input onFocus function if provided
            if(propertiesOnFocus) {
                propertiesOnFocus(event);
            }
        },
        [propertiesSelectOnFocus, propertiesOnFocus],
    );

    // Render the component
    return (
        <div className={mergeClassNames('relative', properties.containerClassName)}>
            {Icon && (
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 content--c">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            <input
                // key={themeClassName} // Force the component to re-render when the theme changes, so that the autofill color is correct
                ref={inputReference}
                id={properties.id}
                className={mergeClassNames(InputTextVariants[variant], InputTextSizes[size], properties.className)}
                type={type}
                defaultValue={properties.defaultValue}
                placeholder={properties.placeholder}
                autoComplete={properties.autoComplete}
                required={properties.required}
                disabled={properties.disabled}
                tabIndex={properties.tabIndex}
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
InputText.displayName = 'InputText';
