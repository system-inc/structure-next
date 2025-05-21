'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputReferenceInterface, InputProperties } from '@structure/source/common/forms/Input';

// Dependencies - Styles
// import { useTheme } from '@structure/source/theme/ThemeProvider';

// Dependencies - Assets
import SearchIcon from '@structure/assets/icons/navigation/SearchIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Classes - InputText

// Common input styles
export const commonInputText =
    // Text
    `text-dark dark:text-light ` +
    // Placeholder
    `placeholder:opacity-70 dark:placeholder:opacity-70 ` +
    // Placeholder (disabled)
    `disabled:placeholder:opacity-20 disabled:dark:placeholder:opacity-20 ` +
    // Disabled
    `disabled:cursor-not-allowed disabled:text-opacity-20 disabled:dark:text-opacity-20`;

// Background styles
export const backgroundStyle =
    // Background
    `bg-light dark:bg-dark+2`;

// Border styles
export const borderStyle =
    // Border
    `rounded-small border border-light-6 dark:border-dark-4 ` +
    // Focus
    `focus:border-neutral dark:focus:border-neutral-3`;

// Focus styles: background and text color changes on hover
export const focusStyle =
    // Focus
    `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`;

// Autofill styles
export const autofillStyle = `autofill:bg-transparent dark:autofill:bg-transparent`;

// InputText - Variants
export const InputTextVariants = {
    // Default variant: standard dark background and text color
    default:
        `${commonInputText} ${backgroundStyle} ${borderStyle} ${focusStyle} ${autofillStyle} ` +
        // Layout and sizing
        `px-3 h-9`,
    search:
        `${commonInputText} ${backgroundStyle} ${borderStyle} ${focusStyle} ${autofillStyle} ` +
        // Focus
        `focus-visible:outline-none focus-visible:ring-0 ` +
        // Layout and sizing
        `pl-9 pr-4 h-9 ` +
        // Border
        `border ` +
        // Background
        `bg-transparent`,
    menuSearch:
        `${commonInputText} ${autofillStyle} ` +
        // Focus
        `focus-visible:outline-none focus-visible:ring-0 ` +
        // Layout and sizing
        `w-full pl-9 pr-4 py-3 ` +
        // Border
        `border-b ` +
        // Background
        `bg-transparent`,
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
    iconPosition?: 'left' | 'right';
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
    const iconPosition = properties.iconPosition || 'left';

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
                <div className={`absolute inset-y-0 ${iconPosition}-0 flex items-center pl-3 text-neutral-2`}>
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
