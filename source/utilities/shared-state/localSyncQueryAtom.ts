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

import { atom, getDefaultStore } from 'jotai';
import {
    // ApolloError,
    QueryOptions,
    type DocumentNode,
    type OperationVariables,
    type TypedDocumentNode,
} from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';

export type LocalSyncQueryAtomType<TData, TVariables extends OperationVariables | undefined> = {
    key: string;
    initialValue?: TData;
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
    options?: {
        queryOptions?: QueryOptions<TVariables, TData>;
        syncOptions?: {
            onQueryFirstLoad?: (newValue: TData) => void;
            onQueryUpdate?: (newValue: TData) => void;
            onLocalUpdate?: (newValue: TData) => void;
            persist?: boolean;
        };
    };
};
type QueryState = {
    hasData: boolean;
    loading: boolean;
    error: undefined | { message: string };
};

export function localSyncQueryAtom<TData, TVariables extends OperationVariables | undefined>({
    key,
    initialValue,
    query,
    options,
}: LocalSyncQueryAtomType<TData, TVariables>) {
    // Get the default store
    const store = getDefaultStore();

    // Initialize the value atom. This will be the local state of the atom.
    const baseAtom = atom(initialValue);

    // Initialize the query state atom. This will be used to track the state of the query.
    const hasDataAtom = atom((get) => get(baseAtom) !== undefined);
    const loadingAtom = atom(false);
    const errorAtom = atom<QueryState['error']>(undefined);
    const queryStateAtom = atom<QueryState>((get) => {
        console.log('loading', get(loadingAtom));
        return {
            hasData: get(hasDataAtom),
            loading: get(loadingAtom),
            error: get(errorAtom),
        };
    });

    // This atom will be used to broadcast the new value to all other tabs
    // const broadcastChannelAtom = atom(typeof window !== 'undefined' ? new BroadcastChannel(key) : undefined);

    // This atom is used to read the value from the baseAtom and update the baseAtom with synced side effects.
    const syncedAtom = atom(
        // Getter: Get the value from the base atom
        (get) => {
            return get(baseAtom);
        },
        // Setter: Update the base atom and broadcast the new value (either via localStorage or BroadcastChannel)
        (get, set, newValue: TData) => {
            // Update the base atom with the new value
            set(baseAtom, newValue);

            // If on the client, update the localStorage or broadcast the new value
            if(typeof window !== 'undefined') {
                if(options?.syncOptions?.persist) {
                    localStorage.setItem(key, JSON.stringify(newValue));
                }
                else {
                    const broadcastChannel = new BroadcastChannel(key);
                    broadcastChannel?.postMessage(newValue);
                }
            }
        },
    );

    // When the syncedAtom is mounted, start listening for updates from the query and get the intitial value from localStorage if it exists
    syncedAtom.onMount = (setAtom) => {
        try {
            // Set the initial value from localStorage if that value exists
            if(options?.syncOptions?.persist && localStorage.getItem(key)) {
                const initialValue = JSON.parse(localStorage.getItem(key) as string) as TData;
                setAtom(initialValue);
            }
            else if(options?.syncOptions?.persist && !localStorage.getItem(key) && initialValue) {
                localStorage.setItem(key, JSON.stringify(initialValue));
                setAtom(initialValue);
            }

            // Start listening for updates from the query
            // FYI: If the query has not been run yet, this will trigger the query
            const queryObserver = apolloClient.watchQuery({
                query: query,
                ...options,
            });
            const querySubscription = queryObserver.subscribe({
                // When the query starts, update the query state atom to reflect that the query is loading
                start: () => {
                    console.log('Query started');
                    store.set(loadingAtom, true);
                },
                // When the query updates, update the atom value and the query state atom. Also call the relevant callbacks.
                next: (result) => {
                    console.log('Query updated');
                    const data = !!result.data ? result.data : undefined;

                    if(data) {
                        // If this is the first time the query has loaded, call the onQueryFirstLoad callback
                        if(!store.get(queryStateAtom).hasData && options?.syncOptions?.onQueryFirstLoad) {
                            options.syncOptions.onQueryFirstLoad(data);
                        }

                        // Call the onQueryUpdate callback
                        if(options?.syncOptions?.onQueryUpdate) {
                            options.syncOptions.onQueryUpdate(data);
                        }

                        // Set loading to false
                        store.set(loadingAtom, false);

                        // Update the atom value
                        setAtom(data);
                    }
                },
                // When the query errors, update the query state atom to reflect the error
                error: (error) => {
                    console.log('Query error');
                    store.set(errorAtom, { message: error.message });
                    store.set(loadingAtom, false);
                },
                // When the query completes, update the query state atom to reflect that the query is no longer loading
                complete: () => {
                    console.log('Query complete');
                    store.set(loadingAtom, false);
                },
            });

            // Start listening for updates from localStorage or BroadcastChannel
            if(typeof window !== 'undefined') {
                if(options?.syncOptions?.persist) {
                    window.addEventListener('storage', (event) => {
                        if(event.key === key) {
                            const newValue = JSON.parse(event.newValue as string) as TData;
                            setAtom(newValue);
                        }
                    });
                }
                else {
                    const broadcastChannel = new BroadcastChannel(key);
                    broadcastChannel.onmessage = (event) => {
                        setAtom(event.data);
                    };
                }
            }

            // When unmounting, unsubscribe from the query and close the BroadcastChannel/EventListeners
            return () => {
                querySubscription.unsubscribe();
                if(typeof window !== 'undefined') {
                    if(options?.syncOptions?.persist) {
                        window.removeEventListener('storage', (event) => {
                            if(event.key === key) {
                                const newValue = JSON.parse(event.newValue as string) as TData;
                                setAtom(newValue);
                            }
                        });
                    }
                    else {
                        const broadcastChannel = new BroadcastChannel(key);
                        broadcastChannel.close();
                    }
                }
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
        function (_get, set, newValue: TData) {
            // Update the atom value
            set(syncedAtom, newValue);
        },
    );

    return atom(
        (get) => {
            return [get(derivedAtom), get(queryStateAtom)] as const;
        },
        (get, set, newValue: TData) => {
            set(derivedAtom, newValue);
        },
    );
}
