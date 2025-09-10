// Dependencies - State Provider
import { gql, networkService } from '@structure/source/services/network/NetworkService';
import React from 'react';
// eslint-disable-next-line
import { useMutation, useQuery } from '@tanstack/react-query';
import { atom, useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Account, accountSignedInKey } from '../Account';
import { GraphQlError } from '@structure/source/api/graphql/GraphQlUtilities';
import { useRouter } from '@structure/source/router/Navigation';

// We'll be using Jotai here instead of a React Context to avoid cascading rerenders from the root
// of our application where possible. As long as we manage atomic state in a sufficiently
// siloed way (i.e., only accessing setters when we don't need to read account state), we'll be able
// to avoid many re-renders across our application.

// Atomic State -- This is bite-sized chunks of what will eventually come together to be complex state.
//
// IMPORTANT: These should be thought of as the most basic building blocks of our state. Derived state
// will come later.

// Account

// ------------------------------
// Types
interface UseAccountInterface {
    isLoading: boolean;
    error: GraphQlError | null;
    data: Account | null; // If this is null, the account is not signed in
    signedIn: boolean;
    signOut: (redirectPath?: string) => Promise<boolean>;
    setSignedIn: (value: boolean) => void;
    setAuthenticationDialogOpen: (value: boolean) => void;
}

// Query Cache Key
export const accountCacheKey = 'account';

// Query & Mutation Documents (No need to recreate these every rerender so they don't need to be in a component)
const accountQueryDocument = gql(`
    query AccountQuery {
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
`);

const accountSignOutMutationDocument = gql(`
    mutation AccountSignOutMutation {
        accountSignOut {
            success
        }
    }
`);

// Atomic State (persisted state and global state)
// This atom will be hydrated in the provider using useHydrateAtoms() that way we don't need to handle an effect
//  for each invokation of the hook
export const accountIsSignedInAtom = atomWithStorage(accountSignedInKey, false, undefined, { getOnInit: true });
// This could be a derived atom, but we want to imperatively set it below so we'll keep it a vanilla atom for now.
const showAuthenticationDialogAtom = atom(false);

export function useAccount(): UseAccountInterface {
    // Router Hook
    const router = useRouter();

    // State
    const [signedIn, setAccountIsSignedIn] = useAtom(accountIsSignedInAtom);
    const setAuthenticationDialogOpen = useSetAtom(showAuthenticationDialogAtom);

    const accountQuery = useQuery({
        queryKey: [accountCacheKey],
        queryFn: async () => {
            try {
                // Fetch the account data
                const response = await networkService.graphQlRequest(accountQueryDocument);

                // If the account is signed in, we want to sync the persisted state with local storage
                if(response.account) {
                    setAccountIsSignedIn(true);
                }

                return response.account;
            }
            catch(err) {
                const error = err as Error;

                // Sync the persisted state with local storage
                setAccountIsSignedIn(false);

                throw new GraphQlError(error.message);
            }
        },
    });
    // State derived from the account query
    // Memoizing this is important because creating a new Account is an expensive operation
    // Otherwise, we could just derive this from the value directly.
    const accountQueryData = accountQuery.data;
    const account = React.useMemo(
        // eslint-disable-next-line
        () => (accountQueryData ? new Account(accountQueryData) : null),
        [accountQueryData],
    );

    const accountSignOutMutation = useMutation({
        mutationFn: async (redirectPath?: string) => {
            // Perform the sign out mutation
            const response = await networkService.graphQlRequest(accountSignOutMutationDocument);

            if(redirectPath) {
                router.push(redirectPath);
            }

            return response.accountSignOut.success;
        },
        onSuccess: () => {
            const queryClient = networkService.getTanStackReactQueryClient();

            setAccountIsSignedIn(false);
            queryClient.invalidateQueries({
                queryKey: [accountCacheKey],
            });
        },
    });

    return {
        // We are loading if the account query is loading or if we are signed in and the account is not loaded
        isLoading: accountQuery.isLoading || Boolean(accountQuery.data && account === null),
        error: accountQuery.error as GraphQlError | null,
        data: account,
        signedIn: Boolean(accountQuery.data || signedIn),
        signOut: accountSignOutMutation.mutateAsync,

        // We shouldn't allow setting signed in state directly. This should be a server-derived piece of state.
        setSignedIn: setAccountIsSignedIn,

        // We shouldn't couple the dialog state to account state (at least imperatively like this),
        // but for consistency's sake we're keeping it in here.
        setAuthenticationDialogOpen,
    };
}
