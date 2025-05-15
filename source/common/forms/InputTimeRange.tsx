'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DateRange as ReactDayPickerDateRange } from 'react-day-picker';
import { InputInterface } from '@structure/source/common/forms/Input';
import { Calendar } from '@structure/source/common/time/Calendar';
import {
    TimeRangeType,
    getTimeRangePresets,
    getMatchingTimeRangePresetKey,
} from '@structure/source/common/time/TimeRange';
import { PopoverInterface, Popover } from '@structure/source/common/popovers/Popover';
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { format, endOfDay, startOfToday, endOfToday, addMonths } from 'date-fns';
import { camelCase } from '@structure/source/utilities/String';

// Interface - InputTimeRangeReference
export interface InputTimeRangeReferenceInterface {
    getValue: () => TimeRangeType | undefined;
    setValue: (value?: TimeRangeType, event?: React.MouseEvent | React.KeyboardEvent | unknown) => void;
    focus: () => void;
}

// Component - InputTimeRange
export interface InputTimeRangeInterface extends Omit<InputInterface, 'defaultValue' | 'onChange' | 'onBlur'> {
    defaultValue?: TimeRangeType;
    placeholder?: string;
    showTimeRangePresets?: boolean;

    // Events
    onChange?: (value: TimeRangeType | undefined) => void;
    onBlur?: (value: TimeRangeType | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    popoverProperties?: Omit<PopoverInterface, 'children' | 'content'>;
    buttonProperties?: ButtonInterface;
}
export const InputTimeRange = React.forwardRef<InputTimeRangeReferenceInterface, InputTimeRangeInterface>(function (
    properties: InputTimeRangeInterface,
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
            if(activeTimeRangePresetLink) {
                activeTimeRangePresetLink.scrollIntoView({
                    behavior: 'instant',
                    block: 'center',
                });
            }
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
            <a
                id={camelCase(properties.text)}
                className={`rounded-medium cursor-pointer p-1.5 text-xs dark:text-light-4 dark:hover:bg-dark-4 ${
                    properties.isActive ? 'bg-light-4/50 dark:bg-dark-4/50' : 'hover:bg-light-4'
                }`}
                onClick={properties.onClick}
            >
                {properties.text}
            </a>
        );
    }, []);

    // Function to create all of the time range links
    const createTimeRangeLinks = React.useCallback(
        function () {
            const links: JSX.Element[] = [];

            // Map through the the time range presets to render TimeRangeLink components
            for(const timeRangePresetKey in TimeRangePresets) {
                const timeRangePreset = TimeRangePresets[timeRangePresetKey]!;

                links.push(
                    <TimeRangeLink
                        key={timeRangePresetKey}
                        text={timeRangePresetKey}
                        onClick={() => {
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
                            <div className="border-b border-light-4 p-2 text-xs dark:border-dark-4">
                                {/* Current Selection */}
                                <p className="font-semibold">{activeTimeRangePresetKey}</p>
                                {/* Date Display */}
                                <div className="flex py-1 font-medium">
                                    {/* Buttons to control navigating forward and backwards through months */}
                                    {value?.startTime && value?.endTime && (
                                        <>
                                            {value?.startTime && (
                                                <button
                                                    onClick={() => {
                                                        if(value?.startTime && value?.endTime) {
                                                            setStartCalendarMonth(value.startTime ?? new Date());
                                                        }
                                                    }}
                                                >
                                                    {format(value.startTime, 'LLL dd, y')}
                                                </button>
                                            )}
                                            <span className="px-1">-</span>
                                            <button
                                                onClick={() => {
                                                    if(value?.startTime && value?.endTime) {
                                                        setStartCalendarMonth(
                                                            addMonths(value.endTime ?? new Date(), -1),
                                                        );
                                                    }
                                                }}
                                            >
                                                {format(value.endTime, 'LLL dd, y')}
                                            </button>
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
                    <div className={`flex flex-col ${showTimeRangePresets ? 'border-l' : ''}`}>
                        <Calendar
                            mode="range"
                            showOutsideDays={false}
                            numberOfMonths={2}
                            defaultMonth={value?.startTime}
                            month={startCalendarMonth}
                            onMonthChange={setStartCalendarMonth} // Required to update the month when the user clicks the previous and next buttons
                            selected={{
                                from: value?.startTime,
                                to: value?.endTime,
                            }}
                            onSelect={handleCalendarSelection}
                        />
                        <div className="flex w-full justify-end p-3">
                            {/* Clear Button */}
                            <Button variant="ghost" onClick={clear}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            }
        >
            <Button
                ref={buttonReference}
                {...properties.buttonProperties}
                tabIndex={properties.tabIndex}
                variant={'formInputSelect'}
                size="formInputSelect"
                className={mergeClassNames(
                    'min-w-[246px]',
                    !value && 'text-muted-foreground',
                    properties.buttonProperties?.className,
                )}
                icon={CalendarIcon}
                iconPosition="left"
                onBlur={onBlurIntercept}
            >
                {/* Display the selected date range or "Pick a date" if no date is selected */}
                {value?.startTime ? (
                    value.endTime ? (
                        <>
                            {format(value.startTime, 'LLL dd, y')} - {format(value.endTime, 'LLL dd, y')}
                        </>
                    ) : (
                        format(value.startTime, 'LLL dd, y')
                    )
                ) : (
                    <span>{placeholder}</span>
                )}
            </Button>
        </Popover>
    );
});

// Set the display name for the component for debugging
InputTimeRange.displayName = 'InputTimeRange';

// Export - Default
export default InputTimeRange;
