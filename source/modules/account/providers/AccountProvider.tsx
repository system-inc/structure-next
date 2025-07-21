'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useRouter } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { AuthenticationDialog } from '@structure/source/modules/account/pages/authentication/components/AuthenticationDialog';

// Dependencies - Account
import { accountSignedInKey, Account } from '@structure/source/modules/account/Account';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { GraphQlError } from '@structure/source/api/graphql/GraphQlUtilities';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Cache key constants
export const accountCacheKey = 'account';

// Context - Account
interface AccountContextInterface {
    accountState: {
        loading: boolean;
        error: GraphQlError | null;
        account: Account | null; // If this is null, the account is not signed in
    };
    signedIn: boolean;
    setSignedIn: (value: boolean) => void;
    signOut: (redirectPath?: string) => Promise<boolean>;
    setAuthenticationDialogOpen: (value: boolean) => void;
}
const AccountContext = React.createContext<AccountContextInterface | undefined>(undefined);

// Component - AccountProvider
export interface AccountProviderProperties {
    children: React.ReactNode;
    signedIn: boolean;
}
export function AccountProvider(properties: AccountProviderProperties) {
    // State
    const [signedIn, setSignedIn] = React.useState<boolean>(properties.signedIn); // Initialized using response header cookie
    // console.log('AccountProvider: signedIn', signedIn);
    const [authenticationDialogOpen, setAuthenticationDialogOpen] = React.useState(false);

    // Hooks
    const router = useRouter();

    // Mutations
    const accountSignOutRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountSignOut {
                accountSignOut {
                    success
                }
            }
        `),
    );

    // Queries
    const accountRequest = networkService.useGraphQlQuery(
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
                    createdAt
                }
            }
        `),
        undefined,
        {
            cacheKey: [accountCacheKey],
            // Do not run the query if the account is not signed in
            enabled: signedIn,
        },
    );

    // Effect to handle query completion
    React.useEffect(
        function () {
            if(accountRequest.data) {
                // If signed in
                if(accountRequest.data.account) {
                    // Update the signed in state
                    setSignedIn(true);

                    // Close the authentication dialog if it is open
                    setAuthenticationDialogOpen(false);
                }
                // If not signed in
                else {
                    // Update the signed in state
                    setSignedIn(false);
                }
            }
        },
        [accountRequest.data],
    );

    // Effect to handle query error
    React.useEffect(
        function () {
            if(accountRequest.error) {
                // If there is an error, the account is not signed in
                setSignedIn(false);
            }
        },
        [accountRequest.error],
    );
    // console.log('accountQueryState', accountQueryState);

    // Create the account object from the GraphQL query data
    const account = React.useMemo(
        function () {
            // If there is account data
            if(accountRequest.data?.account) {
                return new Account(accountRequest.data.account);
            }
            else {
                return null;
            }
        },
        [accountRequest.data?.account],
    );

    // Function to update the signed in state
    const updateSignedIn = React.useCallback(function (value: boolean) {
        // console.log('updateSignedIn', value);

        // Update local storage so other tabs can know the account is signed in
        // Local storage - because it is shared across tabs
        localStorageService.set(accountSignedInKey, value);

        // Update the state
        setSignedIn(value);
    }, []);

    // Function to sign out
    const signOut = React.useCallback(
        async function (redirectPath?: string) {
            // Invoke the GraphQL mutation
            try {
                // Invoke the mutation
                await accountSignOutRequest.execute({});
            }
            catch(error) {
                console.log('error', JSON.stringify(error));
            }

            // Update the signed in state
            updateSignedIn(false);

            // If a redirect path is provided
            if(redirectPath) {
                // Redirect to the path
                router.push(redirectPath);
            }

            return true;
        },
        [accountSignOutRequest, updateSignedIn, router],
    );

    // Effect to reconcile localStorage with initial server-side state
    // This is crucial for environments where the API is on a different domain
    // and HTTP-only cookies cannot be shared between the frontend and API.
    //
    // Flow:
    // 1. User signs in → localStorage is set to true
    // 2. Page refresh → Server can't see cross-domain cookies, assumes signed out
    // 3. This effect runs → Checks localStorage and corrects the state
    // 4. Account query runs → Verifies authentication with API
    React.useEffect(
        function () {
            // Only run on mount
            const storedSignedIn = localStorageService.get<boolean>(accountSignedInKey);

            // If localStorage indicates we're signed in but server-side rendering
            // initialized us as signed out (due to missing cross-domain cookies),
            // update the state to trigger the account query
            if(storedSignedIn === true && !signedIn) {
                // console.log('AccountProvider: localStorage indicates signed in, updating state');
                setSignedIn(true);
            }
            // Note: We don't handle the opposite case (stored false, state true)
            // because the server's cookie check is authoritative in production
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [], // Empty dependency array - only run once on mount
    );

    // Effect to listen for changes in local storage
    React.useEffect(
        function () {
            function handleLocalStorageChange(event: StorageEvent) {
                if(event.key === accountSignedInKey) {
                    updateSignedIn(event.newValue == 'true' ? true : false);
                }
            }

            // Add a listener for changes in local storage
            window.addEventListener('storage', handleLocalStorageChange);

            // On unmount
            return function () {
                // Remove the listener for changes in local storage
                window.removeEventListener('storage', handleLocalStorageChange);
            };
        },
        [updateSignedIn],
    );

    // Render the component
    return (
        <AccountContext.Provider
            value={{
                accountState: {
                    // We are loading if the account query is loading or if we are signed in and the account is not loaded
                    loading: accountRequest.isLoading || (signedIn && account == null),
                    error: accountRequest.error as GraphQlError | null,
                    account: account,
                },
                signedIn: signedIn,
                setSignedIn: updateSignedIn,
                signOut,
                setAuthenticationDialogOpen,
            }}
        >
            {properties.children}

            {/* AuthenticationDialog */}
            {!signedIn && (
                <AuthenticationDialog
                    scope="SignIn"
                    open={authenticationDialogOpen}
                    onOpenChange={setAuthenticationDialogOpen}
                />
            )}
        </AccountContext.Provider>
    );
}

// Hook - useAccount
export function useAccount(): AccountContextInterface {
    const accountContext = React.useContext(AccountContext);
    if(!accountContext) {
        throw new Error('useAccount must be used within an AccountProvider.');
    }
    return accountContext as AccountContextInterface;
}
