'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputProperties } from '@structure/source/common/forms/Input';
import { Calendar } from '@structure/source/common/time/Calendar';
import { PopoverProperties, Popover } from '@structure/source/common/popovers/Popover';
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { format, startOfToday } from 'date-fns';

// Interface - InputDateReference
export interface InputDateReferenceInterface {
    getValue: () => Date | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: (value?: Date, event?: any) => void;
    focus: () => void;
}

// Component - InputDate
export interface InputDateProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: Date;
    placeholder?: string;
    closeOnSelect?: boolean;

    // Events
    onChange?: (value: Date | undefined) => void;
    onBlur?: (value: Date | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    popoverProperties?: Omit<PopoverProperties, 'children' | 'content'>;
    buttonProperties?: ButtonProperties;
}
export const InputDate = React.forwardRef<InputDateReferenceInterface, InputDateProperties>(
    function (properties, reference) {
        // References
        const buttonReference = React.useRef<HTMLButtonElement>(null);

        // State
        const [open, setOpen] = React.useState<boolean>(false);
        const [value, setValue] = React.useState<Date | undefined>(properties.defaultValue);
        const [calendarMonth, setCalendarMonth] = React.useState<Date>(value ?? startOfToday());

        // Defaults
        const placeholder = properties.placeholder || 'Date';
        const closeOnSelect = properties.closeOnSelect ?? true;

        // Function to expose methods to parent components
        React.useImperativeHandle(reference, function () {
            return {
                getValue: function () {
                    return value;
                },
                setValue: function (newValue) {
                    setValue(newValue);
                },
                focus: function () {
                    // Call the focus method on the button's DOM element
                    buttonReference.current?.focus();
                },
            };
        });

        // Function to handle input value changes
        const onChangeIntercept = React.useCallback(
            function (date: Date | undefined) {
                setValue(date);

                // Call the onChange callback if it exists
                properties.onChange?.(date);

                // Optionally close the popover
                if(closeOnSelect) {
                    setOpen(false);
                }
            },
            [properties, closeOnSelect],
        );

        // Function to handle blur events
        const onBlurIntercept = React.useCallback(
            function (event: React.FocusEvent<HTMLButtonElement>) {
                // Run the provided form input onBlur function if provided
                properties.onBlur?.(value, event);
            },
            [properties, value],
        );

        // Function to handle when the user selects a date on the calendar
        const handleCalendarSelection = React.useCallback(
            function (date: Date | undefined) {
                // Set the value
                setValue(date);

                // Invoke the onChange callback
                onChangeIntercept(date);
            },
            [onChangeIntercept],
        );

        // Render the component
        return (
            <Popover
                {...properties.popoverProperties}
                open={open}
                onOpenChange={setOpen}
                content={
                    <div className="flex w-auto">
                        <Calendar
                            mode="single"
                            showOutsideDays={false}
                            numberOfMonths={1}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            selected={value}
                            onSelect={handleCalendarSelection}
                        />
                    </div>
                }
            >
                <Button
                    variant="formInputSelect"
                    size="formInputSelect"
                    className={mergeClassNames(
                        'min-w-[246px]',
                        !value && 'text-muted-foreground',
                        properties.buttonProperties?.className,
                    )}
                    icon={CalendarIcon}
                    iconPosition="left"
                    onBlur={onBlurIntercept}
                    {...properties.buttonProperties}
                >
                    {value ? format(value, 'MMMM d, y') : <span>{placeholder}</span>}
                </Button>
            </Popover>
        );
    },
);

// Set the display name for debugging purposes
InputDate.displayName = 'InputDate';
