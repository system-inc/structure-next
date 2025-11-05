'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import { useRouter } from '@structure/source/router/Navigation';

// Dependencies - Types
import { type AuthenticationDialogSettings } from '@structure/source/modules/account/pages/authentication/components/dialogs/AuthenticationDialog';

// Dependencies - Shared State
import { useAtomValue, useSetAtom } from 'jotai';
import { globalStore } from '@structure/source/utilities/shared-state/SharedStateProvider';
import {
    accountAtom,
    sessionIdHttpOnlyCookieExistsAtom,
    requestAccountData,
    signOut as accountAtomSignOut,
    type AccountStateInterface,
} from '../shared-state/AccountAtom';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';

// Dependencies - API
import { type AccountQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Re-export for backwards compatibility
export { accountAtom, sessionIdHttpOnlyCookieExistsAtom } from '../shared-state/AccountAtom';
export type { AccountStateInterface } from '../shared-state/AccountAtom';

// Type - AccountInterface
export interface AccountInterface extends AccountStateInterface {
    request: () => Promise<void>;
    setSignedIn: (value: boolean) => void;
    setData: (accountData: Partial<AccountQuery['account']>) => void;
    signOut: (redirectPath?: string) => Promise<boolean>;
    setAuthenticationDialogSettings: (settings: Partial<AuthenticationDialogSettings>) => void;
}

// Hook - useAccount
export function useAccount(): AccountInterface {
    // Hooks
    const router = useRouter();

    // Shared State
    const accountAtomValue = useAtomValue(accountAtom);
    const setAccountAtom = useSetAtom(accountAtom);

    // Function to request fresh account data from the server
    async function request() {
        const sessionIdExists = globalStore.get(sessionIdHttpOnlyCookieExistsAtom);
        if(!sessionIdExists) {
            console.warn('[useAccount] Cannot request account - no session ID exists');
            return;
        }

        await requestAccountData(setAccountAtom);
    }

    // Function to update the signed in state
    function setSignedIn(value: boolean) {
        // Update atom (atomWithStorage handles localStorage and cross-tab sync)
        setAccountAtom(function (previousAccountState: AccountStateInterface) {
            return { ...previousAccountState, signedIn: value };
        });
    }

    // Function to update account data with fresh data from mutations
    function setData(accountData: Partial<AccountQuery['account']>) {
        // console.log('[useAccount] setData:', accountData);

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
        // Sign out via AccountAtom (notifies server, clears cache, updates atom)
        await accountAtomSignOut(true);

        // Redirect if path provided
        if(redirectPath) {
            router.push(redirectPath);
        }

        return true;
    }

    // Function to set authentication dialog settings
    function setAuthenticationDialogSettings(settings: Partial<AuthenticationDialogSettings>) {
        // console.log('[useAccount] setAuthenticationDialogSettings:', settings);

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

    // Return the AccountState
    return {
        ...accountAtomValue,
        request,
        setSignedIn,
        setData,
        signOut,
        setAuthenticationDialogSettings,
    };
}
