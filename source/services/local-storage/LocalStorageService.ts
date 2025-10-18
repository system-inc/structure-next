// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Types
import {
    LocalStorageItem,
    LocalStorageItemOptions,
    LocalStorageEventActions,
    LocalStorageEventAction,
    LocalStorageChangeEvent,
    LocalStorageChangeCallback,
} from './internal/LocalStorageServiceTypes';

// Dependencies - Utilities
import { getLocalStorageStatistics, type LocalStorageStatistics } from './internal/LocalStorageServiceUtilities';

// Export - LocalStorageStatistics
export { type LocalStorageStatistics } from './internal/LocalStorageServiceUtilities';

// Export - Types
export {
    LocalStorageEventActions,
    type LocalStorageItemOptions,
    type LocalStorageEventAction,
    type LocalStorageChangeCallback,
} from './internal/LocalStorageServiceTypes';

// Export - useLocalStorageService
export { useLocalStorageService } from './internal/useLocalStorageService';

// Clas - LocalStorageService
// This service provides a wrapper around localStorage with automatic expiration, cross-tab synchronization, and subscription support
class LocalStorageService {
    private readonly prefix: string;
    private readonly eventKey = 'storageSync';
    private readonly subscribers: Map<string, Set<LocalStorageChangeCallback>>;
    private readonly wildcardSubscribers: Set<LocalStorageChangeCallback>;

    constructor() {
        // Initialize the prefix using the project identifier for namespacing
        this.prefix = ProjectSettings.identifier;

        // Initialize subscriber registries
        this.subscribers = new Map();
        this.wildcardSubscribers = new Set();

        // Listen for cross-tab storage events
        // Only set up event listener if running in browser environment
        if(typeof window !== 'undefined') {
            // Bind this context to maintain proper scope in event handler
            window.addEventListener('storage', this.handleStorageChange.bind(this));
        }
    }

    // Function to get a value from localStorage
    get<T>(key: string): T | null {
        // Return null if not in browser environment (e.g., server-side rendering)
        if(typeof window === 'undefined') {
            return null;
        }

        try {
            // Create the full key with project prefix
            const prefixedKey = this.getPrefixedKey(key);
            // Retrieve the raw item from localStorage
            const item = window.localStorage.getItem(prefixedKey);

            // Return null if key doesn't exist
            if(!item) {
                return null;
            }

            // Try to parse as our JSON format first
            try {
                // Parse the stored JSON to get the wrapped value with metadata
                const parsed = JSON.parse(item) as LocalStorageItem<T>;

                // Check if this is our format (has a 'value' property)
                if(parsed && typeof parsed === 'object' && 'value' in parsed) {
                    // Check if item has expired
                    if(parsed.expiresAt && Date.now() > parsed.expiresAt) {
                        // Remove expired item from storage
                        window.localStorage.removeItem(prefixedKey);
                        // Emit expire event instead of using remove() to avoid 'remove' event
                        this.emitStorageEvent(key, LocalStorageEventActions.Expire, null);
                        return null;
                    }

                    // Return the actual stored value
                    return parsed.value;
                }
                else {
                    // JSON parsed but not our format, treat as raw value
                    throw new Error('Not LocalStorageItem format');
                }
            } catch {
                // Not JSON or not our format - this is a legacy raw value
                // Migrate it to the new format
                console.log(`Migrating legacy localStorage value for key "${key}"`);

                // Attempt to parse the value based on type
                let migratedValue: T;

                // Try to parse as JSON first (in case it's a stringified object/array)
                try {
                    migratedValue = JSON.parse(item) as T;
                } catch {
                    // Not JSON, treat as raw string/number/boolean
                    // Try to convert to appropriate type
                    if(item === 'true') {
                        migratedValue = true as T;
                    }
                    else if(item === 'false') {
                        migratedValue = false as T;
                    }
                    else if(item !== '' && !isNaN(Number(item))) {
                        // Check if it's a number
                        migratedValue = Number(item) as T;
                    }
                    else {
                        // Keep as string
                        migratedValue = item as T;
                    }
                }

                // Store in new format (this will trigger the set event)
                this.set(key, migratedValue);

                // Return the migrated value
                return migratedValue;
            }
        }
        catch(error) {
            // Log error and return null if any other error occurs
            console.error(`Error reading from localStorage for key "${key}":`, error);
            return null;
        }
    }

    // Function to set a value in localStorage
    set<T>(key: string, value: T, options?: LocalStorageItemOptions): boolean {
        // Return false if not in browser environment
        if(typeof window === 'undefined') {
            return false;
        }

        try {
            // Create the full key with project prefix
            const prefixedKey = this.getPrefixedKey(key);
            // Wrap the value in a storage item container
            const item: LocalStorageItem<T> = {
                value,
            };

            // Add expiry timestamp if specified in options
            if(options?.expireInMillisecondsFromNow) {
                // Calculate absolute expiry time from current time plus duration
                item.expiresAt = Date.now() + options.expireInMillisecondsFromNow;
            }

            // Store the serialized item in localStorage
            window.localStorage.setItem(prefixedKey, JSON.stringify(item));
            // Notify about the storage change with the new value
            this.emitStorageEvent(key, LocalStorageEventActions.Set, value);
            // Return true to indicate successful storage
            return true;
        }
        catch(error) {
            // Handle quota exceeded error specifically
            if(error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                // Optionally implement cleanup of old items here
                // Could add logic to remove expired items or least recently used items
            }
            else {
                // Log any other errors that occur during storage
                console.error(`Error writing to localStorage for key "${key}":`, error);
            }
            // Return false to indicate storage failure
            return false;
        }
    }

    // Function to remove a value from localStorage
    remove(key: string): void {
        // Exit early if not in browser environment
        if(typeof window === 'undefined') {
            return;
        }

        try {
            // Create the full key with project prefix
            const prefixedKey = this.getPrefixedKey(key);
            // Remove the item from localStorage
            window.localStorage.removeItem(prefixedKey);
            // Notify about the removal
            this.emitStorageEvent(key, LocalStorageEventActions.Remove, null);
        }
        catch(error) {
            // Log any errors that occur during removal
            console.error(`Error removing from localStorage for key "${key}":`, error);
        }
    }

    // Function to check if a key exists in localStorage
    has(key: string): boolean {
        // Return false if not in browser environment
        if(typeof window === 'undefined') {
            return false;
        }

        // Use the get method to check existence
        // This also handles expiry checking automatically
        const value = this.get(key);
        // Key exists if get returns a non-null value
        return value !== null;
    }

    // Function to clear all items with the project prefix
    clear(): void {
        // Exit early if not in browser environment
        if(typeof window === 'undefined') {
            return;
        }

        try {
            // Array to collect keys that need to be removed
            const keysToRemove: string[] = [];

            // Find all keys with our prefix
            // Iterate through all localStorage keys
            for(let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                // Check if key exists and starts with our project prefix
                if(key?.startsWith(this.prefix)) {
                    // Add to removal list
                    keysToRemove.push(key);
                }
            }

            // Remove them
            // Use separate loop to avoid index shifting issues during iteration
            keysToRemove.forEach(function (key) {
                window.localStorage.removeItem(key);
            });

            // Emit a wildcard event to notify about the clear operation
            this.emitStorageEvent('*', LocalStorageEventActions.Clear, null);
        }
        catch(error) {
            // Log any errors that occur during clearing
            console.error('Error clearing localStorage:', error);
        }
    }

    // Function to get all keys (without prefix) that belong to this project
    getAllKeys(): string[] {
        // Return empty array if not in browser environment
        if(typeof window === 'undefined') {
            return [];
        }

        // Array to collect unprefixed keys
        const keys: string[] = [];
        // Cache prefix length for efficient substring operation
        const prefixLength = this.prefix.length;

        try {
            // Iterate through all localStorage keys
            for(let i = 0; i < window.localStorage.length; i++) {
                // Get key at current index
                const key = window.localStorage.key(i);
                // Check if key exists and belongs to our project
                if(key?.startsWith(this.prefix)) {
                    // Strip the prefix and add to results
                    keys.push(key.substring(prefixLength));
                }
            }
        }
        catch(error) {
            // Log any errors but still return collected keys
            console.error('Error getting localStorage keys:', error);
        }

        // Return array of unprefixed keys
        return keys;
    }

    // Function to get local storage statistics
    getLocalStorageStatistics(): LocalStorageStatistics {
        return getLocalStorageStatistics(this.prefix);
    }

    // Function to subscribe to storage changes for a specific key
    subscribe(key: string, callback: LocalStorageChangeCallback): () => void {
        // Handle wildcard subscriptions differently
        if(key === '*') {
            // Add to wildcard subscribers
            this.wildcardSubscribers.add(callback);

            // Return unsubscribe function
            return () => {
                this.wildcardSubscribers.delete(callback);
            };
        }

        // Get or create the set of subscribers for this key
        let keySubscribers = this.subscribers.get(key);
        if(!keySubscribers) {
            keySubscribers = new Set();
            this.subscribers.set(key, keySubscribers);
        }

        // Add the callback to the set
        keySubscribers.add(callback);

        // Return unsubscribe function
        // This allows caller to stop listening when needed
        return () => {
            const subscribers = this.subscribers.get(key);
            subscribers?.delete(callback);
            // Clean up empty sets to prevent memory leaks
            if(subscribers?.size === 0) {
                this.subscribers.delete(key);
            }
        };
    }

    // Function to get the prefixed key
    private getPrefixedKey(key: string): string {
        // Concatenate project prefix with key for namespacing
        return `${this.prefix}${key}`;
    }

    // Function to emit a custom storage event for cross-tab synchronization
    private emitStorageEvent(key: string, action: LocalStorageEventAction, value?: unknown): void {
        try {
            // Create the event data
            const eventData: LocalStorageChangeEvent = {
                key,
                action,
                createdAt: Date.now(),
                value,
            };

            // Use a special event key to notify other tabs
            // Create a new storage event with custom data
            const event = new StorageEvent('storage', {
                // Use our special sync key for cross-tab communication
                key: this.eventKey,
                // Include details about the change in the event value
                newValue: JSON.stringify(eventData),
                // Include the current URL for context
                url: window.location.href,
            });

            // Dispatch the event to notify listeners in all tabs (including current)
            window.dispatchEvent(event);
        }
        catch(error) {
            // Fallback for browsers that don't support StorageEvent constructor
            // Log as warning since this is not critical to functionality
            console.warn('Could not emit storage event:', error);
        }
    }

    // Function to handle storage changes from other tabs
    private handleStorageChange(event: StorageEvent): void {
        // Handle our custom sync events
        // Check if this is one of our sync events (not a regular storage event)
        if(event.key === this.eventKey && event.newValue) {
            try {
                // Parse the event data to understand what changed
                const data = JSON.parse(event.newValue) as LocalStorageChangeEvent;

                // Notify subscribers for this specific key
                const keySubscribers = this.subscribers.get(data.key);
                keySubscribers?.forEach((callback) => {
                    try {
                        callback(data.value ?? null, data.action);
                    }
                    catch(callbackError) {
                        console.error(`Error in storage change callback for key "${data.key}":`, callbackError);
                    }
                });

                // Notify wildcard subscribers for any change
                if(data.key === '*' || this.wildcardSubscribers.size > 0) {
                    this.wildcardSubscribers.forEach((callback) => {
                        try {
                            callback(data.value ?? null, data.action);
                        }
                        catch(callbackError) {
                            console.error('Error in wildcard storage change callback:', callbackError);
                        }
                    });
                }
            }
            catch(error) {
                // Log any errors in parsing sync events
                console.error('Error handling storage sync event:', error);
            }
        }
    }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
