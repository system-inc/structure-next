'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DateRange as ReactDayPickerDateRange } from 'react-day-picker';
import { InputProperties } from '@structure/source/components/forms/Input';
import { Calendar } from '@structure/source/components/time/calendar/Calendar';
import {
    TimeRangeType,
    getTimeRangePresets,
    getMatchingTimeRangePresetKey,
} from '@structure/source/components/time/TimeRange';
import {
    ResponsivePopoverDrawer,
    ResponsivePopoverDrawerProperties,
} from '@structure/source/components/popovers/responsive/ResponsivePopoverDrawer';
import { PopoverProperties } from '@structure/source/components/popovers/Popover';
import { ButtonProperties, Button } from '@structure/source/components/buttons/Button';
import { Drawer } from '@structure/source/components/drawers/Drawer';

// Dependencies - Assets
import { CalendarIcon, CaretDownIcon, ClockIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { format, endOfDay, startOfToday, endOfToday, addMonths } from 'date-fns';
import { camelCase } from '@structure/source/utilities/type/String';
import { useIsMobile } from '@structure/source/utilities/react/hooks/useIsMobile';

// Interface - InputTimeRangeReference
export interface InputTimeRangeReferenceInterface {
    getValue: () => TimeRangeType | undefined;
    setValue: (value?: TimeRangeType, event?: React.MouseEvent | React.KeyboardEvent | unknown) => void;
    focus: () => void;
}

// Component - InputTimeRange
export interface InputTimeRangeProperties extends Omit<InputProperties, 'defaultValue' | 'onChange' | 'onBlur'> {
    // Value (controlled mode takes precedence over defaultValue)
    value?: TimeRangeType;
    defaultValue?: TimeRangeType;

    // Display
    placeholder?: string;
    rangeFormat?: string; // Default: 'LLL d, y'
    showTimeRangePresets?: boolean;

    // Events
    onChange?: (value: TimeRangeType | undefined) => void;
    onBlur?: (value: TimeRangeType | undefined, event: React.FocusEvent<HTMLButtonElement>) => void;

    // Calendar configuration
    calendarProperties?: Omit<React.ComponentPropsWithoutRef<typeof Calendar>, 'mode' | 'selected' | 'onSelect'>;

    // Accessibility (for ResponsivePopoverDrawer)
    accessibilityTitle?: string; // Default: 'Select Date Range'
    accessibilityDescription?: string; // Default: 'Please select a date range'

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
export const InputTimeRange = React.forwardRef<InputTimeRangeReferenceInterface, InputTimeRangeProperties>(function (
    properties: InputTimeRangeProperties,
    reference: React.Ref<InputTimeRangeReferenceInterface>,
) {
    // References
    const buttonReference = React.useRef<HTMLButtonElement>(null);

    // Hooks
    const isMobile = useIsMobile();

    // State
    const [open, setOpen] = React.useState<boolean>(false);
    const [presetsDrawerOpen, setPresetsDrawerOpen] = React.useState<boolean>(false);
    const [internalValue, setInternalValue] = React.useState<TimeRangeType | undefined>(properties.defaultValue);
    const [startCalendarMonth, setStartCalendarMonth] = React.useState<Date>(
        addMonths(properties.value?.endTime ?? properties.defaultValue?.endTime ?? startOfToday(), -1),
    ); // Defaults to the previous month (for the first calendar on the left)
    const [activeTimeRangePresetKey, setActiveTimeRangePresetKey] = React.useState('Last 28 Days');
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    // Determine the current value (controlled mode takes precedence)
    const currentValue = properties.value !== undefined ? properties.value : internalValue;

    // Set mounted state on client only (prevents hydration mismatch for date formatting)
    React.useEffect(function () {
        setIsMounted(true);
    }, []);

    // Defaults
    const placeholder = properties.placeholder ?? 'Time Range';
    const showTimeRangePresets = properties.showTimeRangePresets ?? false;
    const rangeFormat = properties.rangeFormat ?? 'LLL d, y';

    // Sync calendar month when controlled value changes
    React.useEffect(
        function () {
            if(properties.value !== undefined && properties.value?.endTime) {
                setStartCalendarMonth(addMonths(properties.value.endTime, -1));
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
                // when used with FormInputTimeRange which calls setValue from onChange
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
    function onChangeIntercept(dateRange: TimeRangeType | undefined) {
        if(properties.value === undefined) {
            // Only update internal state in uncontrolled mode
            setInternalValue(dateRange);
        }

        // Call the onChange callback if it exists
        properties.onChange?.(dateRange);
    }

    // Function to handle blur events
    function onBlurIntercept(event: React.FocusEvent<HTMLButtonElement>) {
        properties.onBlur?.(currentValue, event);
    }

    // Function to handle when the user selects a date on the calendar
    function handleCalendarSelection(calendarSelection: ReactDayPickerDateRange | undefined) {
        let newValue = undefined;

        if(calendarSelection) {
            // Always make the .to part of the date range be the time at the end of that day
            const endTime = endOfDay(calendarSelection.to ?? endOfToday());

            newValue = {
                startTime: calendarSelection.from,
                endTime: endTime,
            };
        }

        if(properties.value === undefined) {
            // Only update internal state in uncontrolled mode
            setInternalValue(newValue);
        }

        // Update the active preset
        setActiveTimeRangePresetKey(getMatchingTimeRangePresetKey(newValue));

        // Invoke the onChange callback
        onChangeIntercept(newValue);
    }

    // Function to handle clearing the date range
    function clear() {
        if(properties.value === undefined) {
            // Only update internal state in uncontrolled mode
            setInternalValue(undefined);
        }
        setActiveTimeRangePresetKey('Custom');
        // Notify parent of the clear
        properties.onChange?.(undefined);
    }

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
            setActiveTimeRangePresetKey(getMatchingTimeRangePresetKey(currentValue));
        },
        [currentValue],
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
    function createTimeRangeLinks() {
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
    }

    // Render the component
    return (
        <ResponsivePopoverDrawer
            variant="A"
            accessibilityTitle={properties.accessibilityTitle ?? 'Select Date Range'}
            accessibilityDescription={properties.accessibilityDescription ?? 'Please select a date range'}
            open={open}
            onOpenChange={setOpen}
            trigger={
                <Button
                    ref={buttonReference}
                    tabIndex={properties.tabIndex}
                    variant="InputSelectTrigger"
                    size="InputSelectTrigger"
                    className={mergeClassNames(
                        'min-w-[246px] pl-2',
                        !currentValue && 'content--1',
                        properties.buttonProperties?.className,
                    )}
                    iconLeft={CalendarIcon}
                    onBlur={onBlurIntercept}
                    disabled={properties.disabled}
                    {...properties.buttonProperties}
                >
                    {/* Display the selected date range or placeholder if no date is selected */}
                    {isMounted && currentValue?.startTime ? (
                        currentValue.endTime ? (
                            <>
                                {format(currentValue.startTime, rangeFormat)} -{' '}
                                {format(currentValue.endTime, rangeFormat)}
                            </>
                        ) : (
                            format(currentValue.startTime, rangeFormat)
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    {/* Spacer to push caret to the right */}
                    <div className="grow" />
                    {/* Dropdown caret */}
                    <CaretDownIcon className="ml-4 h-4 w-4 content--2" />
                </Button>
            }
            content={
                <div className="flex w-auto flex-col md:flex-row">
                    {/* Time Range Presets - Desktop sidebar */}
                    {showTimeRangePresets && !isMobile && (
                        <div className="flex w-48 flex-col">
                            {/* Summary Header */}
                            <div className="border-b border--0 p-2 text-xs">
                                {/* Current Selection */}
                                <p className="font-semibold">{activeTimeRangePresetKey}</p>
                                {/* Date Display */}
                                <div className="flex py-1 font-medium">
                                    {/* Buttons to control navigating forward and backwards through months */}
                                    {isMounted && currentValue?.startTime && currentValue?.endTime && (
                                        <>
                                            {currentValue?.startTime && (
                                                <Button
                                                    onClick={function () {
                                                        if(currentValue?.startTime && currentValue?.endTime) {
                                                            setStartCalendarMonth(currentValue.startTime ?? new Date());
                                                        }
                                                    }}
                                                >
                                                    {format(currentValue.startTime, rangeFormat)}
                                                </Button>
                                            )}
                                            <span className="px-1">-</span>
                                            <Button
                                                onClick={function () {
                                                    if(currentValue?.startTime && currentValue?.endTime) {
                                                        setStartCalendarMonth(
                                                            addMonths(currentValue.endTime ?? new Date(), -1),
                                                        );
                                                    }
                                                }}
                                            >
                                                {format(currentValue.endTime, rangeFormat)}
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
                    <div
                        className={mergeClassNames(
                            'flex flex-col',
                            showTimeRangePresets && !isMobile && 'border-l border--0',
                            isMobile && 'items-center pt-3',
                        )}
                    >
                        <Calendar
                            mode="range"
                            showOutsideDays={true}
                            numberOfMonths={isMobile ? 1 : 2}
                            defaultMonth={currentValue?.startTime}
                            month={startCalendarMonth}
                            onMonthChange={setStartCalendarMonth}
                            selected={{
                                from: currentValue?.startTime,
                                to: currentValue?.endTime,
                            }}
                            modifiers={{
                                single_day: function (date) {
                                    if(!currentValue?.startTime || !currentValue?.endTime) return false;
                                    const startTime =
                                        currentValue.startTime instanceof Date
                                            ? currentValue.startTime
                                            : new Date(currentValue.startTime);
                                    const endTime =
                                        currentValue.endTime instanceof Date
                                            ? currentValue.endTime
                                            : new Date(currentValue.endTime);
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
                            {...properties.calendarProperties}
                        />
                        <div className="flex w-full items-center justify-end gap-2 px-3 pb-3">
                            {/* Mobile presets button - opens nested drawer */}
                            {showTimeRangePresets && isMobile && (
                                <Drawer
                                    variant="A"
                                    accessibilityTitle="Time Range Presets"
                                    accessibilityDescription="Select a preset time range"
                                    open={presetsDrawerOpen}
                                    onOpenChange={setPresetsDrawerOpen}
                                    footerCloseButton={true}
                                    trigger={
                                        <Button variant="B" iconLeft={ClockIcon}>
                                            {activeTimeRangePresetKey}
                                        </Button>
                                    }
                                >
                                    <Drawer.Header>Time Range Presets</Drawer.Header>
                                    <Drawer.Body className="p-0">
                                        <div className="flex flex-col gap-1 p-3">
                                            {Object.entries(TimeRangePresets).map(function ([presetKey, preset]) {
                                                return (
                                                    <button
                                                        key={presetKey}
                                                        type="button"
                                                        className={mergeClassNames(
                                                            'cursor-pointer rounded-lg px-4 py-3 text-left text-sm hover:background--2 active:background--4',
                                                            activeTimeRangePresetKey === presetKey
                                                                ? 'background--3 font-medium content--0'
                                                                : 'content--1',
                                                        )}
                                                        onClick={function () {
                                                            handleCalendarSelection({
                                                                from: preset.startTime,
                                                                to: preset.endTime,
                                                            });
                                                            setStartCalendarMonth(
                                                                addMonths(preset.endTime ?? new Date(), -1),
                                                            );
                                                            setPresetsDrawerOpen(false);
                                                        }}
                                                    >
                                                        {presetKey}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Drawer.Body>
                                </Drawer>
                            )}
                            {/* Clear Button */}
                            <Button variant="B" onClick={clear}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            }
            popoverProperties={{
                align: 'Start',
                onOpenAutoFocus: scrollToActiveTimeRangePresetLink,
                ...properties.popoverProperties,
                ...properties.responsivePopoverDrawerProperties?.popoverProperties,
            }}
            drawerProperties={properties.responsivePopoverDrawerProperties?.drawerProperties}
            {...properties.responsivePopoverDrawerProperties}
        />
    );
});

// Set the display name on the component for debugging
InputTimeRange.displayName = 'InputTimeRange';
