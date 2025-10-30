'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import { useRouter } from '@structure/source/router/Navigation';

// Dependencies - Shared State
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';
import { type AuthenticationDialogSettings } from '@structure/source/modules/account/pages/authentication/components/dialogs/AuthenticationDialog';
import { isGraphQlAuthenticationError } from '@structure/source/modules/account/utilities/AccountUtilities';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { GraphQlError } from '@structure/source/api/graphql/utilities/GraphQlUtilities';
import { AccountDocument, type AccountQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';
import { globalStore } from '@structure/source/utilities/shared-state/SharedStateProvider';

// Cache key constants
export const accountLocalStorageKey = 'Account';

// Atom - Session ID exists (set from server-side cookie check)
export const sessionIdHttpOnlyCookieExistsAtom = atom<boolean>(false);

// Type - AccountState
export interface AccountStateInterface {
    isLoading: boolean;
    data: Account | null;
    error: GraphQlError | null;
    signedIn: boolean;
    authenticationDialogSettings: AuthenticationDialogSettings;
}

// Function to reconstruct Account class instance from plain object
function reconstructAccountData(data: unknown): Account | null {
    if(!data) {
        return null;
    }
    return new Account(data as AccountQuery['account']);
}

// Function to create default account state
function createDefaultAccountState(): AccountStateInterface {
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

// Function to create timestamp string for logging
function createTimestamp(): string {
    return performance.now().toFixed(2);
}

// Function to log with timestamp
function logWithTimestamp(prefix: string, message: string, data?: unknown): void {
    const timestamp = createTimestamp();
    if(data !== undefined) {
        console.log(`[${timestamp}ms] [${prefix}] ${message}`, data);
    }
    else {
        console.log(`[${timestamp}ms] [${prefix}] ${message}`);
    }
}

// Function to get initial account state
// Note: This is called during module initialization, before server data is available
// Server data is handled in onMount and custom storage getItem instead
function getInitialAccountState(): AccountStateInterface {
    // Return default state (server data will be applied in onMount)
    return createDefaultAccountState();
}

// Type - AccountInterface
export interface AccountInterface extends AccountStateInterface {
    setSignedIn: (value: boolean) => void;
    setData: (accountData: Partial<AccountQuery['account']>) => void;
    signOut: (redirectPath?: string) => Promise<boolean>;
    setAuthenticationDialogSettings: (settings: Partial<AuthenticationDialogSettings>) => void;
}

// Shared State - Account Atom with localStorage persistence
const accountAtom = atomWithStorage<AccountStateInterface>(
    accountLocalStorageKey,
    getInitialAccountState(), // Load initial state synchronously from localStorage
    // Custom storage that deserializes Account class instances
    {
        getItem: function (key: string, initialValue: AccountStateInterface): AccountStateInterface {
            logWithTimestamp('AccountStorage', 'getItem called with key:', key);

            // Read from localStorage
            const storedValue = localStorageService.get<AccountStateInterface>(key);
            logWithTimestamp('AccountStorage', 'storedValue from localStorage:', storedValue);

            if(!storedValue) {
                console.log('[AccountStorage] No stored value, returning initialValue');
                return initialValue;
            }

            try {
                // localStorageService.get already parses JSON, but we need to reconstruct the Account class
                const parsed = storedValue;

                // Reconstruct Account class instance if data exists
                // After JSON.parse, data is a plain object matching the GraphQL response shape
                if(parsed.data) {
                    console.log('[AccountStorage] Reconstructing Account class from stored data');
                    parsed.data = reconstructAccountData(parsed.data);
                }

                logWithTimestamp('AccountStorage', 'Returning parsed account:', {
                    signedIn: parsed.signedIn,
                    hasData: !!parsed.data,
                    emailAddress: parsed.data?.emailAddress,
                    profileImageUrl: parsed.data?.profile?.images?.[0]?.url,
                });
                return parsed;
            }
            catch(error) {
                console.error('[AccountStorage] Failed to parse stored account:', error);
                return initialValue;
            }
        },
        setItem: function (key: string, value: AccountStateInterface): void {
            const timestamp = createTimestamp();
            logWithTimestamp('AccountStorage', `setItem called with key: ${key}`, {
                signedIn: value.signedIn,
                hasData: !!value.data,
                emailAddress: value.data?.emailAddress,
                isLoading: value.isLoading,
            });

            // Log stack trace to see WHO is calling setItem (last 5 items only)
            const stackTrace = new Error().stack;
            const stackLines = stackTrace?.split('\n').slice(1, 6).join('\n') || 'No stack trace available';
            console.log(`[${timestamp}ms] [AccountStorage] setItem stack trace (last 5):\n${stackLines}`);

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
            // Handle cross-tab synchronization via storage events
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
                            parsed.data = reconstructAccountData(parsed.data);
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

// Global guard to prevent duplicate account requests across React dev mode remounts
// React 19 dev mode (and React 18 Strict Mode) intentionally double-mount components
// Without this guard, onMount would be called twice and trigger duplicate GraphQL requests
let globalAccountRequestInProgress = false;

accountAtom.onMount = function (setAtom) {
    let mounted = true;

    logWithTimestamp('AccountAtom', 'Mounting - first subscriber connected');

    // Function to fetch account data from GraphQL
    async function requestAccount() {
        if(!mounted) {
            return;
        }

        // Check global guard to prevent duplicate requests from React dev mode double-mounting
        if(globalAccountRequestInProgress) {
            console.log('[AccountAtom] Request already in progress (React dev mode remount), skipping duplicate');
            return;
        }

        console.log('[AccountAtom] Fetching account data from GraphQL');
        globalAccountRequestInProgress = true;

        // Mark the atom as loading
        setAtom(function (previousAccountState: AccountStateInterface) {
            return { ...previousAccountState, isLoading: true };
        });

        // Perform the GraphQL request
        try {
            const accountRequest = await networkService.graphQlRequest(AccountDocument);

            // If signed in
            if(accountRequest.account) {
                // Create a new Account instance
                const account = new Account(accountRequest.account);
                console.log('[AccountAtom] Account loaded:', account.emailAddress);

                // Update the atom state
                setAtom(function (previousAccountState: AccountStateInterface) {
                    return {
                        ...previousAccountState,
                        data: account,
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
            // If no account returned, the user is signed out
            else {
                console.log('[AccountAtom] No account returned - user signed out');

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
            console.error('[AccountAtom] Failed to fetch account:', error);

            // Check if this is an authentication error (session/account invalid)
            // vs. a network error (can't reach server)
            if(isGraphQlAuthenticationError(error)) {
                console.log('[AccountAtom] Authentication error detected - clearing cache and signing out');
                // Authentication error means definitively not signed in
                // Clear all account data and cache
                setAtom(function (previousAccountState: AccountStateInterface) {
                    return {
                        data: null,
                        isLoading: false,
                        error: error as GraphQlError,
                        signedIn: false,
                        authenticationDialogSettings: previousAccountState.authenticationDialogSettings,
                    };
                });
            }
            else {
                console.log('[AccountAtom] Network error detected - preserving cached account data');
                // Network error - preserve cached account data but show error
                // User might still be signed in, just can't reach server
                setAtom(function (previousAccountState: AccountStateInterface) {
                    return {
                        ...previousAccountState,
                        isLoading: false,
                        error: error as GraphQlError,
                        // Don't change signedIn state - preserve what we had cached
                    };
                });
            }
        } finally {
            // Reset global guard to allow future requests
            globalAccountRequestInProgress = false;
        }
    }

    // Get current state (atomWithStorage already loaded from localStorage)
    const currentState = globalStore.get(accountAtom);
    const sessionIdExists = globalStore.get(sessionIdHttpOnlyCookieExistsAtom);
    logWithTimestamp('AccountAtom', 'Current state on mount:', {
        signedIn: currentState.signedIn,
        sessionIdExists: sessionIdExists,
        hasData: !!currentState.data,
        emailAddress: currentState.data?.emailAddress,
        profileImageUrl: currentState.data?.profile?.images?.[0]?.url,
    });

    // Determine if we should request fresh account data based on session ID cookie
    const shouldRequestAccount = sessionIdExists;

    if(shouldRequestAccount) {
        console.log('[AccountAtom] Fetching fresh account data in background (session ID exists)');
        requestAccount();
    }
    else if(currentState.data) {
        console.log('[AccountAtom] WARNING: Have cached account data but no session ID - signed out?');
    }

    console.log('[AccountAtom] Initialized');

    // Cleanup
    return function () {
        console.log('[AccountAtom] Unmounting - last subscriber disconnected');
        mounted = false;
    };
};

// Hook - useAccount
export function useAccount(): AccountInterface {
    // Hooks
    const router = useRouter();

    // Shared State
    const accountAtomValue = useAtomValue(accountAtom);
    const setAccountAtom = useSetAtom(accountAtom);

    // Function to update the signed in state
    function setSignedIn(value: boolean) {
        console.log('[useAccount] setSignedIn:', value);

        // Update atom (atomWithStorage handles localStorage and cross-tab sync)
        setAccountAtom(function (prev: AccountStateInterface) {
            return { ...prev, signedIn: value };
        });
    }

    // Function to update account data with fresh data from mutations
    function setData(accountData: Partial<AccountQuery['account']>) {
        console.log('[useAccount] setData:', accountData);

        setAccountAtom(function (previousAccountState: AccountStateInterface) {
            // If no existing account data, create new Account instance
            if(!previousAccountState.data) {
                return {
                    ...previousAccountState,
                    data: new Account(accountData as AccountQuery['account']),
                };
            }

            // Merge new data with existing account data
            const mergedData = {
                ...previousAccountState.data,
                ...accountData,
            };

            // Create new Account instance with merged data
            return {
                ...previousAccountState,
                data: new Account(mergedData as AccountQuery['account']),
            };
        });
    }

    // Function to sign out
    async function signOut(redirectPath?: string) {
        console.log('[useAccount] signOut called');

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
            console.error('[useAccount] Sign out error:', error);
        }

        // Clear all cache (memory + localStorage + sessionStorage)
        networkService.clearCache();

        // Update the account atom (atomWithStorage handles localStorage and cross-tab sync)
        setAccountAtom(createDefaultAccountState());

        // Redirect if path provided
        if(redirectPath) {
            router.push(redirectPath);
        }

        return true;
    }

    // Function to set authentication dialog settings
    function setAuthenticationDialogSettings(settings: Partial<AuthenticationDialogSettings>) {
        console.log('[useAccount] setAuthenticationDialogSettings:', settings);

        setAccountAtom(function (previousAccountState: AccountStateInterface) {
            return {
                ...previousAccountState,
                authenticationDialogSettings: {
                    ...previousAccountState.authenticationDialogSettings,
                    ...settings,
                },
            };
        });
    }

    return {
        ...accountAtomValue,
        setSignedIn,
        setData,
        signOut,
        setAuthenticationDialogSettings,
    };
}
