'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Interface - Calendar Navigation Configuration
export interface CalendarNavigationConfiguration {
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    minimumYear?: number;
    maximumYear?: number;
}

// Default configuration values
const currentYear = new Date().getFullYear();
const defaultNavigationConfiguration: CalendarNavigationConfiguration = {
    showMonthDropdown: true,
    showYearDropdown: true,
    minimumYear: currentYear - 100,
    maximumYear: currentYear,
};

// Context - Calendar
const CalendarContext = React.createContext<CalendarNavigationConfiguration>(defaultNavigationConfiguration);

// Hook - useCalendarContext
export function useCalendarContext() {
    return React.useContext(CalendarContext);
}

// Component - CalendarProvider
export interface CalendarProviderProperties {
    children: React.ReactNode;
    navigationConfiguration?: CalendarNavigationConfiguration;
}
export function CalendarProvider(properties: CalendarProviderProperties) {
    // Merge user configuration with defaults
    const mergedConfiguration = {
        ...defaultNavigationConfiguration,
        ...properties.navigationConfiguration,
    };

    return (
        <CalendarContext.Provider value={mergedConfiguration}>
            {properties.children}
        </CalendarContext.Provider>
    );
}
