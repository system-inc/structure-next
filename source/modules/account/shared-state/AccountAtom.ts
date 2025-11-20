'use client'; // This hook uses client-only features

// Dependencies - Types
import { BaseError } from '@structure/source/api/errors/BaseError';
import { type AuthenticationDialogSettings } from '@structure/source/modules/account/authentication/components/dialogs/AuthenticationDialog';

// Dependencies - Shared State
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { globalStore } from '@structure/source/utilities/shared-state/SharedStateProvider';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { type AccountQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - Utilities
import { isEqual } from '@structure/source/utilities/type/Object';

// Constant - Account Local Storage Key
export const accountLocalStorageKey = 'Account';

// Atom - Session ID HttpOnly Cookie Exists
export const sessionIdHttpOnlyCookieExistsAtom = atom<boolean>(false);

// Type - AccountState
export interface AccountStateInterface {
    isLoading: boolean;
    data: Account | null;
    error: BaseError | null;
    signedIn: boolean;
    authenticationDialogSettings: AuthenticationDialogSettings;
}

// Function to reconstruct Account class instance from plain object
function reconstructAccountDataFromJson(data: unknown): Account | null {
    if(!data) {
        return null;
    }

    // Runtime validation - ensure data is an object
    if(typeof data !== 'object' || data === null) {
        console.error('[AccountStorage] Invalid data type for Account reconstruction:', typeof data);
        return null;
    }

    // Attempt to construct Account instance with error handling
    try {
        return new Account(data as AccountQuery['account']);
    }
    catch(error) {
        console.error('[AccountStorage] Failed to construct Account instance:', error);
        return null;
    }
}

// Function to create default account state
export function createDefaultAccountState(): AccountStateInterface {
    return {
        signedIn: false,
        data: null,
        isLoading: false,
        error: null,
        authenticationDialogSettings: {
            open: false,
            scope: 'SignIn',
        },
    };
}

// Guard to prevent duplicate account requests
// Without this guard, onMount would be called twice and trigger duplicate GraphQL requests
let accountRequestInProgress = false;

// Function to request account data from GraphQL
// This is called both from onMount and from the request() method exposed via useAccount
export async function requestAccountData(
    setAtom: (update: (previousAccountState: AccountStateInterface) => AccountStateInterface) => void,
): Promise<void> {
    // Check global guard to prevent duplicate requests
    if(accountRequestInProgress) {
        return;
    }

    accountRequestInProgress = true;

    // Mark the atom as loading
    setAtom(function (previousAccountState: AccountStateInterface) {
        return { ...previousAccountState, isLoading: true };
    });

    // Perform the GraphQL request
    try {
        const accountRequest = await networkService.graphQlRequest(
            gql(`
                query Account {
                    account {
                        emailAddress
                        profile {
                            id
                            username
                            displayName
                            givenName
                            familyName
                            images {
                                url
                                variant
                            }
                            updatedAt
                            createdAt
                        }
                        accessRoles
                        entitlements
                        createdAt
                    }
                }
            `),
        );

        // If signed in
        if(accountRequest.account) {
            // Create a new Account instance
            const newAccountInstance = new Account(accountRequest.account);
            // console.log('[requestAccountData] Account loaded:', newAccountInstance.emailAddress);

            // Get current account data to compare
            const currentAccountInstance = globalStore.get(accountAtom).data;

            // Only update the atom if the account data actually changed
            // This prevents unnecessary re-renders when the GraphQL data is identical to cached data
            const accountDataChanged = !isEqual(currentAccountInstance, newAccountInstance);

            if(accountDataChanged) {
                // console.log('[requestAccountData] Updating atom with new account data, signedIn: true');

                // Update the atom state
                setAtom(function (previousAccountState: AccountStateInterface) {
                    return {
                        ...previousAccountState,
                        data: newAccountInstance,
                        isLoading: false,
                        error: null,
                        signedIn: true,
                        authenticationDialogSettings: {
                            ...previousAccountState.authenticationDialogSettings,
                            open: false, // Close dialog on successful sign in
                        },
                    };
                });
            }
            else {
                // Just update isLoading to false without changing the account data reference
                setAtom(function (previousAccountState: AccountStateInterface) {
                    return {
                        ...previousAccountState,
                        isLoading: false,
                        error: null,
                    };
                });
            }
        }
        // If no account returned, the user is signed out
        else {
            console.log('[requestAccountData] No account returned - user signed out');

            // Update the atom state
            setAtom(function (previousAccountState: AccountStateInterface) {
                return {
                    ...previousAccountState,
                    data: null,
                    isLoading: false,
                    error: null,
                    signedIn: false,
                };
            });
        }
    }
    catch(error) {
        console.error('[requestAccountData] Failed to fetch account:', error);

        // Check if this is an authentication error (session/account invalid)
        // vs. a network error (can't reach server)
        if(BaseError.isAuthenticationError(error)) {
            console.log('[AccountAtom] Authentication error detected - clearing cache and signing out');
            // Authentication error means definitively not signed in
            // Clear all account data and cache
            setAtom(function (previousAccountState: AccountStateInterface) {
                return {
                    data: null,
                    isLoading: false,
                    error: BaseError.fromUnknownError(error),
                    signedIn: false,
                    authenticationDialogSettings: previousAccountState.authenticationDialogSettings,
                };
            });
        }
        else {
            // console.log('[AccountAtom] Network error detected - preserving cached account data');
            // Network error - preserve cached account data but show error
            // User might still be signed in, just can't reach server
            setAtom(function (previousAccountState: AccountStateInterface) {
                return {
                    ...previousAccountState,
                    isLoading: false,
                    error: BaseError.fromUnknownError(error),
                    // Don't change signedIn state - preserve what we had cached
                };
            });
        }
    } finally {
        // Reset global guard to allow future requests
        accountRequestInProgress = false;
    }
}

// Function to sign out
// This handles both client-side cleanup and optional server-side session invalidation
export async function signOut(notifyServer: boolean = true): Promise<void> {
    // console.log('[AccountAtom] signOut called, notifyServer:', notifyServer);

    // Optionally notify server to invalidate session
    if(notifyServer) {
        try {
            // Execute GraphQL sign out mutation
            await networkService.graphQlRequest(
                gql(`
                    mutation AccountSignOut {
                        accountSignOut {
                            success
                        }
                    }
                `),
            );
        }
        catch(error) {
            console.error('[AccountAtom] Sign out error:', error);
            // Note: We continue with local cleanup even if the server request fails
            // The server-side session may already be expired or invalid
        }
    }

    // Clear all cache (memory + localStorage + sessionStorage)
    networkService.clearCache();

    // Update the account atom (atomWithStorage handles localStorage and cross-tab sync)
    globalStore.set(accountAtom, createDefaultAccountState());
}

// Shared State - Account Atom
// Account Atom with localStorage persistence
export const accountAtom = atomWithStorage<AccountStateInterface>(
    accountLocalStorageKey,
    createDefaultAccountState(),
    // Custom storage that deserializes Account class instances
    {
        // Custom storage implementation reconstructs Account class instances from localStorage
        getItem: function (key: string, initialValue: AccountStateInterface): AccountStateInterface {
            // Read from localStorage, data is a plain object matching the GraphQL response shape
            const storedValue = localStorageService.get<AccountStateInterface>(key);
            // console.log('AccountStorage', 'storedValue from localStorage:', storedValue);

            if(!storedValue) {
                // console.log('[AccountStorage] No stored value, returning initialValue');
                return initialValue;
            }

            try {
                // localStorageService.get already parses JSON, but we need to reconstruct the Account class
                const parsed = storedValue;

                // Reconstruct Account class instance if data exists
                if(parsed.data) {
                    const reconstructed = reconstructAccountDataFromJson(parsed.data);

                    // If reconstruction failed, clear invalid data
                    if(!reconstructed) {
                        console.warn('[AccountStorage] Account reconstruction failed, clearing account data');
                        parsed.data = null;
                        parsed.signedIn = false;
                    }
                    else {
                        parsed.data = reconstructed;
                    }
                }

                return parsed;
            }
            catch(error) {
                console.error('[AccountStorage] Failed to parse stored account:', error);
                return initialValue;
            }
        },
        setItem: function (key: string, value: AccountStateInterface): void {
            localStorageService.set(key, value);
        },
        removeItem: function (key: string): void {
            localStorageService.remove(key);
        },
        subscribe: function (
            key: string,
            callback: (value: AccountStateInterface) => void,
            initialValue: AccountStateInterface,
        ) {
            // Cross-tab synchronization via storage events
            // Listens for storage events from other browser tabs and reconstructs Account instances
            // This ensures all tabs stay in sync when sign-in/sign-out happens in any tab
            const handleStorageChange = function (event: StorageEvent) {
                // Get the prefixed key that localStorageService uses
                const prefixedKey = localStorageService.getPrefixedKey(key);

                if(event.key === prefixedKey && event.newValue) {
                    try {
                        // localStorageService wraps values in { value: ... }
                        const wrapped = JSON.parse(event.newValue) as { value: AccountStateInterface };
                        const parsed = wrapped.value;

                        // Reconstruct Account class instance if data exists
                        if(parsed.data) {
                            const reconstructed = reconstructAccountDataFromJson(parsed.data);

                            // If reconstruction failed, clear invalid data
                            if(!reconstructed) {
                                console.warn(
                                    '[AccountStorage] Account reconstruction failed in storage event, clearing account data',
                                );
                                parsed.data = null;
                                parsed.signedIn = false;
                            }
                            else {
                                parsed.data = reconstructed;
                            }
                        }

                        callback(parsed);
                    }
                    catch(error) {
                        console.error('[AccountStorage] Failed to parse storage event:', error);
                    }
                }
                else if(event.key === prefixedKey && event.newValue === null) {
                    // Key was removed (sign out in another tab)
                    callback(initialValue);
                }
            };

            window.addEventListener('storage', handleStorageChange);

            // Return cleanup function
            return function () {
                window.removeEventListener('storage', handleStorageChange);
            };
        },
    },
);
// Function to run when the the accountAtom mounts
accountAtom.onMount = function (setAtom) {
    // Determine if we should request fresh account data based on session ID cookie
    const sessionIdExists = globalStore.get(sessionIdHttpOnlyCookieExistsAtom);
    const currentAccountState = globalStore.get(accountAtom);

    // If sessionId cookie exists, always request fresh account data
    if(sessionIdExists) {
        requestAccountData(setAtom);
    }
    // If there is no sessionId cookie but we have cached account data
    else if(currentAccountState.data) {
        console.log('[AccountAtom.onMount] No session ID but have cached data, clearing it');
        // Clear cached account data
        setAtom(createDefaultAccountState());
    }
};
