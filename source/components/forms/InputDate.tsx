'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputProperties } from '@structure/source/components/forms/Input';
import { Calendar } from '@structure/source/components/time/calendar/Calendar';
import {
    ResponsivePopoverDrawer,
    ResponsivePopoverDrawerProperties,
} from '@structure/source/components/popovers/responsive/ResponsivePopoverDrawer';
import { PopoverProperties } from '@structure/source/components/popovers/Popover';
import { ButtonProperties, Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { format, startOfToday } from 'date-fns';

// Interface - InputDateReference
export interface InputDateReferenceInterface {
    getValue: () => Date | undefined;
    setValue: (value?: Date, event?: unknown) => void;
    focus: () => void;
}

// Component - InputDate
export interface InputDateProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    // Value (controlled mode takes precedence over defaultValue)
    value?: Date;
    defaultValue?: Date;

    // Display
    placeholder?: string;
    dateFormat?: string; // Default: 'MMMM d, y'
    suffixText?: string; // Text displayed after the formatted date

    // Behavior
    closeOnSelect?: boolean;

    // Events
    onChange?: (value: Date | undefined) => void;
    onBlur?: (value: Date | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    // Calendar configuration
    calendarProperties?: Omit<React.ComponentPropsWithoutRef<typeof Calendar>, 'mode' | 'selected' | 'onSelect'>;

    // Accessibility (for ResponsivePopoverDrawer)
    accessibilityTitle?: string; // Default: 'Select Date'
    accessibilityDescription?: string; // Default: 'Please select a date'

    // ResponsivePopoverDrawer configuration
    responsivePopoverDrawerProperties?: Omit<
        ResponsivePopoverDrawerProperties,
        'trigger' | 'content' | 'open' | 'onOpenChange' | 'accessibilityTitle' | 'accessibilityDescription'
    >;

    // Deprecated: Use responsivePopoverDrawerProperties.popoverProperties instead
    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'children' | 'content'>;

    // Button configuration
    buttonProperties?: Omit<ButtonProperties, 'icon' | 'iconLeft' | 'iconRight' | 'asChild' | 'href' | 'target'>;
}
export const InputDate = React.forwardRef<InputDateReferenceInterface, InputDateProperties>(
    function (properties, reference) {
        // References
        const buttonReference = React.useRef<HTMLButtonElement>(null);

        // State
        const [open, setOpen] = React.useState<boolean>(false);
        const [internalValue, setInternalValue] = React.useState<Date | undefined>(properties.defaultValue);
        const [calendarMonth, setCalendarMonth] = React.useState<Date>(
            properties.value ?? properties.defaultValue ?? startOfToday(),
        );

        // Determine the current value (controlled mode takes precedence)
        const currentValue = properties.value !== undefined ? properties.value : internalValue;

        // Defaults
        const placeholder = properties.placeholder ?? 'Date';
        const closeOnSelect = properties.closeOnSelect ?? true;
        const dateFormat = properties.dateFormat ?? 'MMMM d, y';

        // Sync calendar month when controlled value changes
        React.useEffect(
            function () {
                if(properties.value !== undefined) {
                    setCalendarMonth(properties.value);
                }
            },
            [properties.value],
        );

        // Function to expose methods to parent components
        React.useImperativeHandle(reference, function () {
            return {
                getValue: function () {
                    return currentValue;
                },
                setValue: function (newValue) {
                    // Only update internal state - don't call onChange to avoid infinite loops
                    // when used with FormInputDate which calls setValue from onChange
                    if(properties.value === undefined) {
                        setInternalValue(newValue);
                    }
                },
                focus: function () {
                    buttonReference.current?.focus();
                },
            };
        });

        // Function to handle input value changes
        function onChangeIntercept(date: Date | undefined) {
            if(properties.value === undefined) {
                // Only update internal state in uncontrolled mode
                setInternalValue(date);
            }

            // Call the onChange callback if it exists
            properties.onChange?.(date);

            // Optionally close the popover
            if(closeOnSelect) {
                setOpen(false);
            }
        }

        // Function to handle blur events
        function onBlurIntercept(event: React.FocusEvent<HTMLButtonElement>) {
            properties.onBlur?.(currentValue, event);
        }

        // Function to handle when the user selects a date on the calendar
        function handleCalendarSelection(date: Date | undefined) {
            onChangeIntercept(date);
        }

        // Render the component
        return (
            <ResponsivePopoverDrawer
                variant="A"
                accessibilityTitle={properties.accessibilityTitle ?? 'Select Date'}
                accessibilityDescription={properties.accessibilityDescription ?? 'Please select a date'}
                open={open}
                onOpenChange={setOpen}
                trigger={
                    <Button
                        ref={buttonReference}
                        variant="InputSelectTrigger"
                        size="InputSelectTrigger"
                        className={mergeClassNames(
                            'min-w-[246px]',
                            !currentValue && 'content--1',
                            properties.buttonProperties?.className,
                        )}
                        iconLeft={CalendarIcon}
                        onBlur={onBlurIntercept}
                        tabIndex={properties.tabIndex}
                        disabled={properties.disabled}
                        {...properties.buttonProperties}
                    >
                        {currentValue ? (
                            <>
                                {format(currentValue, dateFormat)}
                                {properties.suffixText && ` ${properties.suffixText}`}
                            </>
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                }
                content={
                    <div className="flex w-auto justify-center p-3">
                        <Calendar
                            mode="single"
                            showOutsideDays={false}
                            numberOfMonths={1}
                            month={calendarMonth}
                            onMonthChange={setCalendarMonth}
                            selected={currentValue}
                            onSelect={handleCalendarSelection}
                            {...properties.calendarProperties}
                        />
                    </div>
                }
                popoverProperties={{
                    align: 'Start',
                    ...properties.popoverProperties,
                    ...properties.responsivePopoverDrawerProperties?.popoverProperties,
                }}
                drawerProperties={properties.responsivePopoverDrawerProperties?.drawerProperties}
                {...properties.responsivePopoverDrawerProperties}
            />
        );
    },
);

// Set the display name on the component for debugging
InputDate.displayName = 'InputDate';
