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
import { AccountSignOutDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

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
    const accountSignOutMutation = networkService.useGraphQlMutation(AccountSignOutDocument);

    // Queries
    const accountQueryState = networkService.useGraphQlQuery(
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
            // Do not run the query if the account is not signed in
            enabled: signedIn,
        },
    );

    // Effect to handle query completion
    React.useEffect(
        function () {
            if(accountQueryState.data) {
                // If signed in
                if(accountQueryState.data.account) {
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
        [accountQueryState.data],
    );

    // Effect to handle query error
    React.useEffect(
        function () {
            if(accountQueryState.error) {
                // If there is an error, the account is not signed in
                setSignedIn(false);
            }
        },
        [accountQueryState.error],
    );
    // console.log('accountQueryState', accountQueryState);

    // Create the account object from the GraphQL query data
    const account = React.useMemo(
        function () {
            // If there is account data
            if(accountQueryState.data?.account) {
                return new Account(accountQueryState.data.account);
            }
            else {
                return null;
            }
        },
        [accountQueryState.data?.account],
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
                await accountSignOutMutation.execute({});
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
        [accountSignOutMutation, updateSignedIn, router],
    );

    // Effect to update local storage on mount
    React.useEffect(function () {
        localStorageService.set(accountSignedInKey, signedIn);
    });

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
                    loading: accountQueryState.isLoading || (signedIn && account == null),
                    error: accountQueryState.error as GraphQlError | null,
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
