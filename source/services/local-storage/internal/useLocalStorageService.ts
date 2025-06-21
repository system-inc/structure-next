'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import { LocalStorageItemOptions, LocalStorageEventActions } from './LocalStorageServiceTypes';

// Dependencies - LocalStorageService
import { localStorageService } from './../LocalStorageService';

// Hook options interface
export interface UseLocalStorageServiceOptions<T> extends LocalStorageItemOptions {
    defaultValue?: T;
}

// Hook return type with object API
export interface UseLocalStorageServiceReturn<T> {
    value: T | null;
    set: (value: T, options?: LocalStorageItemOptions) => void;
    remove: () => void;
    exists: boolean;
    isLoading: boolean;
}

// React hook for using localStorage with automatic synchronization
export function useLocalStorageService<T>(
    key: string,
    options?: UseLocalStorageServiceOptions<T>,
): UseLocalStorageServiceReturn<T> {
    // State for the current value
    const [value, setValue] = React.useState<T | null>(null);
    // State to track if we're still loading the initial value
    const [isLoading, setIsLoading] = React.useState(true);

    // Load initial value on mount (client-side only)
    React.useEffect(
        function () {
            // Get the initial value from localStorage
            const storedValue = localStorageService.get<T>(key);

            // Use stored value if it exists, otherwise use default
            if(storedValue !== null) {
                setValue(storedValue);
            }
            else if(options?.defaultValue !== undefined) {
                // Set default value if provided and no stored value exists
                setValue(options.defaultValue);
                // Store the default value with expiry if specified
                localStorageService.set(key, options.defaultValue, {
                    expireInMillisecondsFromNow: options.expireInMillisecondsFromNow,
                });
            }

            // Mark as loaded
            setIsLoading(false);
        },
        [key, options?.defaultValue, options?.expireInMillisecondsFromNow],
    );

    // Subscribe to changes
    React.useEffect(
        function () {
            // Subscribe to changes for this key
            const unsubscribe = localStorageService.subscribe(key, function (newValue, action) {
                // Update state based on the action
                if(action === LocalStorageEventActions.Set) {
                    setValue(newValue as T);
                }
                else if(action === LocalStorageEventActions.Remove || action === LocalStorageEventActions.Expire) {
                    setValue(null);
                }
                else if(action === LocalStorageEventActions.Clear) {
                    // Check if our key was affected by the clear
                    const currentValue = localStorageService.get<T>(key);
                    setValue(currentValue);
                }
            });

            // Cleanup subscription on unmount
            return unsubscribe;
        },
        [key],
    );

    // Memoized set function
    const set = React.useCallback(
        function (newValue: T, setOptions?: LocalStorageItemOptions) {
            const success = localStorageService.set(key, newValue, setOptions || options);
            if(success) {
                // Update local state immediately for responsiveness
                setValue(newValue);
            }
        },
        [key, options],
    );

    // Memoized remove function
    const remove = React.useCallback(
        function () {
            localStorageService.remove(key);
            // Update local state immediately
            setValue(null);
        },
        [key],
    );

    // Compute exists based on current value
    const exists = value !== null;

    // Return the object API
    return {
        value,
        set,
        remove,
        exists,
        isLoading,
    };
}
