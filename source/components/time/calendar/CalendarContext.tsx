'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Theme
import { CalendarSize, calendarTheme, CalendarSizeConfiguration } from './CalendarTheme';

// Interface - Calendar Navigation Configuration
export interface CalendarNavigationConfiguration {
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    minimumYear?: number;
    maximumYear?: number;
}

// Interface - Calendar Context Value
export interface CalendarContextValue extends CalendarNavigationConfiguration {
    sizeClasses: CalendarSizeConfiguration;
}

// Default configuration values
const currentYear = new Date().getFullYear();
const defaultSize = calendarTheme.configuration.defaultVariant?.size ?? 'Base';
const defaultContextValue: CalendarContextValue = {
    showMonthDropdown: true,
    showYearDropdown: true,
    minimumYear: currentYear - 100,
    maximumYear: currentYear,
    sizeClasses: calendarTheme.sizes[defaultSize]!,
};

// Context - Calendar
const CalendarContext = React.createContext<CalendarContextValue>(defaultContextValue);

// Hook - useCalendarContext
export function useCalendarContext() {
    return React.useContext(CalendarContext);
}

// Component - CalendarProvider
export interface CalendarProviderProperties {
    children: React.ReactNode;
    navigationConfiguration?: CalendarNavigationConfiguration;
    size?: CalendarSize;
}
export function CalendarProvider(properties: CalendarProviderProperties) {
    // Resolve size
    const resolvedSize = properties.size ?? calendarTheme.configuration.defaultVariant?.size ?? 'Base';
    const sizeClasses = calendarTheme.sizes[resolvedSize]!;

    // Merge user configuration with defaults
    const mergedConfiguration: CalendarContextValue = {
        ...defaultContextValue,
        ...properties.navigationConfiguration,
        sizeClasses,
    };

    return <CalendarContext.Provider value={mergedConfiguration}>{properties.children}</CalendarContext.Provider>;
}
