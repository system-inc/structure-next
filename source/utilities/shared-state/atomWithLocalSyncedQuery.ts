// This is an atom that uses local storage to sync its state between tabs and the server.
// The primary use case for this is to store a query's response in local storage so that the user
// doesn't have to be connected to the internet to see the query's response if it has been fetched
// previously.
//
// Example usage:
// ```tsx
// const shipmentAddressesAtom = atomWithLocalSyncedQuery({
//   key: 'shipmentAddresses',
//   queryDocument: GetShipmentAddressesDocument,
//   queryOptions: {
//     variables: {
//       someVariable: 'someValue',
//   },
//   getValueFromStorageOnFirstRender: false, // Default is true, but can sometimes cause hydration issues.
// });
//
// const App = () => {
//   const { data, loading, error } = useAtomValue(shipmentAddressesAtom);
//
//  [... rest of component]
// };
// ```

import { OperationVariables, QueryOptions, TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

interface AtomWithLocalSyncedQueryArgs<TData, TVariables extends OperationVariables> {
    key: string;
    queryDocument: TypedDocumentNode<TData, TVariables>;
    queryOptions?: QueryOptions<TVariables, TData>;

    // Storage atom options
    getValueFromStorageOnFirstRender?: boolean;

    // Callbacks
    onStorageUpdate?: (newValue: TData | null) => void;
    onQueryUpdate?: (newValue: TData) => void;
    onError?: (error: Error) => void;

    // Initial value
    initialValue?: TData;
}

export function atomWithLocalSyncedQuery<TData, TVariables extends OperationVariables>({
    key,
    queryDocument,
    queryOptions,
    getValueFromStorageOnFirstRender = true,
    onStorageUpdate,
    onQueryUpdate,
    onError,
    initialValue,
}: AtomWithLocalSyncedQueryArgs<TData, TVariables>) {
    // The localStorageAtom will be the the atom that is responsible for syncing the data between local
    // storage and the baseDataAtom.
    const localStorageAtom = atomWithStorage(key, initialValue, undefined, {
        getOnInit: getValueFromStorageOnFirstRender,
    });

    // The localStorageAtomWithUpdates is a read-only atom that runs the onStorageUpdate callback whenever the value
    // is updated and returns the value.
    const localStorageAtomWithUpdates = atom(
        (get) => {
            return get(localStorageAtom);
        },
        (_, set, update: TData | undefined) => {
            set(localStorageAtom, update);
            if(onStorageUpdate) {
                onStorageUpdate(update ?? null);
            }
        },
    );

    // The baseQueryAtom will be initialized with the initial value, but will be updated by the server with the
    // latest value on mount.
    interface QueryAtomValue {
        data: TData | undefined;
        loading: boolean;
        error: Error | undefined;
    }

    // The baseQueryAtom is the foundation of the query state.
    const baseQueryAtom = atom<QueryAtomValue>({ data: initialValue, loading: true, error: undefined });

    // The queryAtomWithStorageUpdate is a derived atom that updates the localStorageAtom whenever the baseQueryAtom
    // is updated.
    const queryAtomWithStorageUpdate = atom(
        // Getter
        (get) => get(baseQueryAtom),
        // Setter
        (get, set, update: Partial<QueryAtomValue>) => {
            // Get the current value of the baseQueryAtom
            const currentValue = get(baseQueryAtom);

            // Set the baseQueryAtom to the new value
            set(baseQueryAtom, { ...currentValue, ...update });

            // Update the localStorageAtom with the new value
            if(update.data) set(localStorageAtomWithUpdates, update.data);
        },
    );
    // On mount, the queryAtomWithStorageUpdate will fetch the latest data from the server and update the baseQueryAtom state
    queryAtomWithStorageUpdate.onMount = (setQueryAtomValue) => {
        let cleanupSubscription: (() => void) | undefined;
        async function startSubscription() {
            // Start by setting the loading state to true
            setQueryAtomValue({ loading: true });

            // Try to subscribe to the query and update the queryAtom state
            try {
                // Get the observer by watching the query
                const observer = apolloClient.watchQuery<TData, TVariables>({
                    query: queryDocument,
                    ...queryOptions,
                });

                // Get the subscription
                const subscription = observer.subscribe({
                    // When we get a result, update the queryAtom state accordingly
                    next: (result) => {
                        // Handle loading state
                        if(result.loading) {
                            setQueryAtomValue({ loading: true });
                        }
                        else {
                            setQueryAtomValue({ loading: false });
                        }

                        // Handle error state
                        if(result.error) {
                            setQueryAtomValue({ error: result.error });
                            if(onError) {
                                onError(result.error);
                            }
                        }

                        // Handle data state
                        if(result.data) {
                            setQueryAtomValue({ data: result.data });
                            if(onQueryUpdate) {
                                onQueryUpdate(result.data);
                            }
                        }
                    },
                    // If the subscription errors, update the queryAtom error state
                    error: (error) => {
                        if(error instanceof Error) {
                            setQueryAtomValue({ loading: false, error });
                        }

                        if(onError) {
                            onError(error);
                        }
                        else {
                            console.error('Error fetching data:', error);
                        }
                    },
                    // If the subscription completes, update the queryAtom loading state
                    complete: () => {
                        setQueryAtomValue({ loading: false });
                    },
                });

                // Return the unsubscribe function to clean up the subscription on unmount
                cleanupSubscription = () => subscription.unsubscribe();
            }
            catch(error) {
                // If something fails in the subscription, update the queryAtom error state
                // If the error is an instance of Error, update the queryAtom error state
                if(error instanceof Error) {
                    setQueryAtomValue({ loading: false, error });
                    if(onError) {
                        onError(error);
                    }
                }
                // Otherwise, log the error to the console
                else {
                    console.error('Error fetching data:', error);
                }
            }
        }
        startSubscription();

        return () => {
            if(cleanupSubscription) {
                cleanupSubscription();
            }
        };
    };

    //
    const atomThatDefaultsToLocalStorage = atom(
        (get) => {
            const localStorageValue = get(localStorageAtomWithUpdates);
            const queryStateAndValue = get(queryAtomWithStorageUpdate);

            // console.log('localStorageValue', localStorageValue);
            // console.log('queryStateAndValue', queryStateAndValue);

            return { ...queryStateAndValue, data: localStorageValue ?? queryStateAndValue.data };
        },
        (_, set, update: TData) => {
            set(localStorageAtomWithUpdates, update);
        },
    );

    return atomThatDefaultsToLocalStorage;
}
