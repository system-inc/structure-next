import { atom } from 'jotai';
import { type DocumentNode, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';

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
    const broadcastChannelAtom = atom(typeof window !== 'undefined' ? new BroadcastChannel(key) : undefined);

    const baseAtom = atom<TData | undefined>(undefined);
    const syncedAtom = atom(
        async (get) => {
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

    baseAtom.onMount = (setAtom) => {
        try {
            // Set the initial value from localStorage
            setAtom(
                syncOptions?.persist && localStorage.getItem(key)
                    ? (JSON.parse(localStorage.getItem(key)!) as TData)
                    : undefined,
            );

            // Start listening for updates from the query
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
        async function (get) {
            const atomValue = await get(syncedAtom);
            return atomValue;
        },
        // Setter
        async function (get, set, newValue: TData) {
            // Update the atom value
            set(syncedAtom, newValue);
            // Update the Apollo cache
            // await apolloClient.cache.updateQuery(
            //     {
            //         query,
            //         variables: queryVariables,
            //     },
            //     (old) => ({
            //         ...old,
            //         ...newValue,
            //     }),
            // );
        },
    );

    return derivedAtom;
}
