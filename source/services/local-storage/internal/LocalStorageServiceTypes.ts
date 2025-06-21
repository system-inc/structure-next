// Type - LocalStorageItem
export interface LocalStorageItem<T> {
    value: T;
    expiresAt?: number;
}

// Type - LocalStorageItemOptions
export interface LocalStorageItemOptions {
    expireInMillisecondsFromNow?: number;
}

// Type - LocalStorageEventActions
export const LocalStorageEventActions = {
    Set: 'set', // Item was added or updated in storage
    Remove: 'remove', // Item was explicitly removed from storage
    Clear: 'clear', // All items were cleared from storage
    Expire: 'expire', // Item was auto-removed due to expiration
} as const;

// Derive the type from the const object
export type LocalStorageEventAction = (typeof LocalStorageEventActions)[keyof typeof LocalStorageEventActions];

// Type - LocalStorageChangeEvent
export interface LocalStorageChangeEvent {
    key: string;
    action: LocalStorageEventAction;
    createdAt: number; // Unix timestamp in milliseconds
    value?: unknown;
}

// Type - LocalStorageChangeCallback
export type LocalStorageChangeCallback = (value: unknown | null, action: LocalStorageEventAction) => void;
