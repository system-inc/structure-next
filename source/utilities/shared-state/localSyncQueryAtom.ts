/**
    The functionality of this utility atom has changed a lot with changing expectations of its application.
    I want to realign the use-case of this atom with our goals, then I'll be adjusting the implementation to match.

    Currently, I'm thinking to update the atom to be instantiated with a key, a query, and options.
        - key: string
        - initialValue: TData,
        - query: DocumentNode | TypedDocumentNode<TData, TVariables>
        - options: {
            - queryOptions: ApolloQueryOptions<TVariables>
            - syncOptions: {
                - onQueryFirstLoad: (newValue: TData) => void
                - onQueryUpdate: (newValue: TData) => void
                - onLocalUpdate: (newValue: TData) => void
                - persist: boolean
            }
        }

    The returned atom will be a tuple of the current value and the query state.
        - currentValue: TData
        - queryState: {
            - queryComplete: boolean
            - loading: boolean
            - error: undefined | ApolloError
            - refetch: () => void
        }

    The atom will also include a setter function that will update the local state and call the onLocalUpdate callback.
        - This setter function will also broadcast the new value to all other tabs (either via localStorage or BroadcastChannel depending on the persist option)
*/

import { atom } from 'jotai';
import { type DocumentNode, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';

type QueryState = {
    hasData: boolean;
    loading: boolean;
    error: undefined | { message: string };
};

export function localSyncQueryAtom<TData, TVariables extends OperationVariables | undefined>(
    key: string,
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    queryVariables?: TVariables | undefined,
    syncOptions?:
        | {
              preferLocal?: boolean;
              persist?: false;
              getOnInitialization?: false;
          }
        | {
              preferLocal?: boolean;
              persist: true;
              getOnInitialization?: boolean;
          },
) {
    const queryStateAtom = atom<QueryState>(() => {
        const queryResult = apolloClient.readQuery({
            query: query,
            variables: queryVariables,
        });

        return {
            hasData: !!queryResult,
            loading: false,
            error: undefined,
        };
    });

    const broadcastChannelAtom = atom(typeof window !== 'undefined' ? new BroadcastChannel(key) : undefined);

    const baseAtom = atom<TData | undefined>(undefined);
    const syncedAtom = atom(
        (get) => {
            return get(baseAtom);
        },
        async (get, set, newValue: TData) => {
            set(baseAtom, newValue);
            if(syncOptions?.persist) {
                localStorage.setItem(key, JSON.stringify(newValue));
            }
            else {
                // Broadcast the new value to all other tabs
                get(broadcastChannelAtom)?.postMessage(newValue);
            }
        },
    );

    syncedAtom.onMount = (setAtom) => {
        try {
            // Set the initial value from localStorage if that value exists
            const localStorageValue =
                syncOptions?.persist && localStorage.getItem(key)
                    ? (JSON.parse(localStorage.getItem(key)!) as TData)
                    : undefined;
            if(localStorageValue !== undefined) {
                setAtom(localStorageValue);
            }

            // Start listening for updates from the query
            // If the query has not been run yet, this will trigger the query
            const queryObserver = apolloClient.watchQuery({
                query: query,
                variables: queryVariables,
            });
            const subscription = queryObserver.subscribe((result) => {
                const data = !!result.data ? result.data : undefined;

                if(data && !syncOptions?.preferLocal) {
                    setAtom(data);
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
        catch(error) {
            console.error(error);
        }
    };

    const derivedAtom = atom(
        // Getter
        function (get) {
            const atomValue = get(syncedAtom);
            return atomValue;
        },
        // Setter
        function (get, set, newValue: TData) {
            // Update the atom value
            set(syncedAtom, newValue);
        },
    );

    return atom(
        (get) => [get(derivedAtom), get(queryStateAtom)] as const,
        (get, set, newValue: TData) => {
            set(derivedAtom, newValue);
        },
    );
}
