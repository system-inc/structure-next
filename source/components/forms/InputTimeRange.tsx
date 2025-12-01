'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DateRange as ReactDayPickerDateRange } from 'react-day-picker';
import { InputProperties } from '@structure/source/components/forms/Input';
import { Calendar } from '@structure/source/components/time/Calendar';
import {
    TimeRangeType,
    getTimeRangePresets,
    getMatchingTimeRangePresetKey,
} from '@structure/source/components/time/TimeRange';
import { PopoverProperties, Popover } from '@structure/source/components/popovers/Popover';
import { ButtonProperties, Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';
import ChevronDownIcon from '@structure/assets/icons/interface/ChevronDownIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { format, endOfDay, startOfToday, endOfToday, addMonths } from 'date-fns';
import { camelCase } from '@structure/source/utilities/type/String';

// Interface - InputTimeRangeReference
export interface InputTimeRangeReferenceInterface {
    getValue: () => TimeRangeType | undefined;
    setValue: (value?: TimeRangeType, event?: React.MouseEvent | React.KeyboardEvent | unknown) => void;
    focus: () => void;
}

// Component - InputTimeRange
export interface InputTimeRangeProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: TimeRangeType;
    placeholder?: string;
    showTimeRangePresets?: boolean;

    // Events
    onChange?: (value: TimeRangeType | undefined) => void;
    onBlur?: (value: TimeRangeType | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    popoverProperties?: Omit<PopoverProperties, 'trigger' | 'children' | 'content'>;
    buttonProperties?: Omit<ButtonProperties, 'icon' | 'iconLeft' | 'iconRight' | 'asChild' | 'href' | 'target'>;
}
export const InputTimeRange = React.forwardRef<InputTimeRangeReferenceInterface, InputTimeRangeProperties>(function (
    properties: InputTimeRangeProperties,
    reference: React.Ref<InputTimeRangeReferenceInterface>,
) {
    // References
    const buttonReference = React.useRef<HTMLButtonElement>(null);

    // State
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<TimeRangeType | undefined>(properties.defaultValue);
    const [startCalendarMonth, setStartCalendarMonth] = React.useState<Date>(
        addMonths(value?.endTime ?? startOfToday(), -1),
    ); // Defaults to the previous month (for the first calendar on the left)
    const [activeTimeRangePresetKey, setActiveTimeRangePresetKey] = React.useState('Last 28 Days');
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    // Set mounted state on client only (prevents hydration mismatch for date formatting)
    React.useEffect(function () {
        setIsMounted(true);
    }, []);

    // Defaults
    const placeholder = properties.placeholder || 'Time Range';
    const showTimeRangePresets = properties.showTimeRangePresets ?? false;

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
        };
    });

    // Function to handle input value changes
    const onChangeIntercept = React.useCallback(
        function (dateRange: TimeRangeType | undefined) {
            // Set the value
            setValue(dateRange);

            // Call the onChange callback if it exists
            properties.onChange?.(dateRange);

            // Close the popover
            // setOpen(false);
        },
        [properties],
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
        function (calendarSelection: ReactDayPickerDateRange | undefined) {
            let value = undefined;

            if(calendarSelection) {
                // Always make the .to part of the date range be the time at the end of that day
                calendarSelection.to = endOfDay(calendarSelection.to ?? endOfToday());

                value = {
                    startTime: calendarSelection.from,
                    endTime: calendarSelection.to,
                };
            }

            // Set the value
            setValue(value);

            // Update the active preset
            setActiveTimeRangePresetKey(getMatchingTimeRangePresetKey(value));

            // Invoke the onChange callback
            onChangeIntercept(value);
        },
        [onChangeIntercept],
    );

    // Function to handle clearing the date range
    const clear = React.useCallback(async function () {
        // Reset the value and set the active preset to "Custom"
        setValue(undefined);
        setActiveTimeRangePresetKey('Custom');
    }, []);

    // Function to scroll to the active time range preset link
    const scrollToActiveTimeRangePresetLink = React.useCallback(
        function () {
            const activeTimeRangePresetLink = document.getElementById(camelCase(activeTimeRangePresetKey));
            activeTimeRangePresetLink?.scrollIntoView({
                behavior: 'instant',
                block: 'center',
            });
        },
        [activeTimeRangePresetKey],
    );

    // Update active time range preset key whenever the value changes
    React.useEffect(
        function () {
            setActiveTimeRangePresetKey(getMatchingTimeRangePresetKey(value));
        },
        [value],
    );

    // Get the time range presets
    const TimeRangePresets = getTimeRangePresets();

    // Function to create a time range link
    const TimeRangeLink = React.useCallback(function (properties: {
        text: string;
        isActive: boolean;
        onClick: () => void;
    }) {
        return (
            <button
                type="button"
                id={camelCase(properties.text)}
                className={mergeClassNames(
                    'cursor-pointer rounded-md p-1.5 text-left text-xs hover:background--2 hover:content--1 active:background--5 active:content--0',
                    properties.isActive ? 'background--4 content--0' : 'content--2',
                )}
                onClick={properties.onClick}
            >
                {properties.text}
            </button>
        );
    }, []);

    // Function to create all of the time range links
    const createTimeRangeLinks = React.useCallback(
        function () {
            const links: React.JSX.Element[] = [];

            // Map through the the time range presets to render TimeRangeLink components
            for(const timeRangePresetKey in TimeRangePresets) {
                const timeRangePreset = TimeRangePresets[timeRangePresetKey]!;

                links.push(
                    <TimeRangeLink
                        key={timeRangePresetKey}
                        text={timeRangePresetKey}
                        onClick={function () {
                            // Call the handler function for the preset
                            handleCalendarSelection({
                                from: timeRangePreset.startTime,
                                to: timeRangePreset.endTime,
                            });

                            // Update the month displayed in the calendar
                            setStartCalendarMonth(addMonths(timeRangePreset.endTime ?? new Date(), -1));
                        }}
                        isActive={activeTimeRangePresetKey === timeRangePresetKey}
                    />,
                );
            }

            return links;
        },
        [TimeRangeLink, TimeRangePresets, activeTimeRangePresetKey, handleCalendarSelection],
    );

    // Render the component
    return (
        <Popover
            {...properties.popoverProperties}
            open={open} // Control the popover using state
            onOpenChange={setOpen} // Update the state when the popover is opened or closed
            onOpenAutoFocus={scrollToActiveTimeRangePresetLink} // Scroll to the active time range preset link when the popover opens
            content={
                <div className="flex w-auto">
                    {/* Time Range Presets */}
                    {showTimeRangePresets && (
                        <div className="flex w-48 flex-col">
                            {/* Summary Header */}
                            <div className="border-b border--0 p-2 text-xs">
                                {/* Current Selection */}
                                <p className="font-semibold">{activeTimeRangePresetKey}</p>
                                {/* Date Display */}
                                <div className="flex py-1 font-medium">
                                    {/* Buttons to control navigating forward and backwards through months */}
                                    {isMounted && value?.startTime && value?.endTime && (
                                        <>
                                            {value?.startTime && (
                                                <Button
                                                    onClick={function () {
                                                        if(value?.startTime && value?.endTime) {
                                                            setStartCalendarMonth(value.startTime ?? new Date());
                                                        }
                                                    }}
                                                >
                                                    {format(value.startTime, 'LLL d, y')}
                                                </Button>
                                            )}
                                            <span className="px-1">-</span>
                                            <Button
                                                onClick={function () {
                                                    if(value?.startTime && value?.endTime) {
                                                        setStartCalendarMonth(
                                                            addMonths(value.endTime ?? new Date(), -1),
                                                        );
                                                    }
                                                }}
                                            >
                                                {format(value.endTime, 'LLL d, y')}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="relative h-full">
                                <div className="absolute inset-0 h-full w-full overflow-y-auto">
                                    <div className="flex flex-col p-1.5">{createTimeRangeLinks()}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={mergeClassNames('flex flex-col', showTimeRangePresets && 'border-l border--0')}>
                        <Calendar
                            mode="range"
                            showOutsideDays={true}
                            numberOfMonths={2}
                            defaultMonth={value?.startTime}
                            month={startCalendarMonth}
                            onMonthChange={setStartCalendarMonth} // Required to update the month when the user clicks the previous and next buttons
                            selected={{
                                from: value?.startTime,
                                to: value?.endTime,
                            }}
                            modifiers={{
                                single_day: function (date) {
                                    if(!value?.startTime || !value?.endTime) return false;
                                    const startTime =
                                        value.startTime instanceof Date ? value.startTime : new Date(value.startTime);
                                    const endTime =
                                        value.endTime instanceof Date ? value.endTime : new Date(value.endTime);
                                    return (
                                        date.toDateString() === startTime.toDateString() &&
                                        date.toDateString() === endTime.toDateString()
                                    );
                                },
                            }}
                            modifiersClassNames={{
                                single_day: 'rdp-single_day',
                            }}
                            onSelect={handleCalendarSelection}
                        />
                        <div className="flex w-full justify-end p-3">
                            {/* Clear Button */}
                            <Button variant="A" size="Small" onClick={clear}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            }
            trigger={
                <Button
                    ref={buttonReference}
                    tabIndex={properties.tabIndex}
                    variant={'InputSelectTrigger'}
                    size="InputSelectTrigger"
                    className={mergeClassNames(
                        'min-w-[246px] pl-2',
                        !value && 'content--1',
                        properties.buttonProperties?.className,
                    )}
                    iconLeft={<CalendarIcon className="mr-2 h-4 w-4" />}
                    onBlur={onBlurIntercept}
                    {...properties.buttonProperties}
                >
                    {/* Display the selected date range or "Pick a date" if no date is selected */}
                    {isMounted && value?.startTime ? (
                        value.endTime ? (
                            <>
                                {format(value.startTime, 'LLL d, y')} - {format(value.endTime, 'LLL d, y')}
                            </>
                        ) : (
                            format(value.startTime, 'LLL d, y')
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    {/* Spacer to push caret to the right */}
                    <div className="grow" />
                    {/* Dropdown caret */}
                    <ChevronDownIcon className="ml-4 h-4 w-4 content--2" />
                </Button>
            }
        />
    );
});

// Set the display name on the component for debugging
InputTimeRange.displayName = 'InputTimeRange';
