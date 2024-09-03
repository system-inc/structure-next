// TODO: Maybe add a 'persist' option to use local storage or BroadcastChannel API to sync the data between tabs.

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { type DocumentNode, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';
import { atomWithBroadcast } from './atomWithBroadcast';

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
    const syncedAtom = syncOptions?.persist
        ? atomWithStorage<TData | undefined>(
              key, // Local storage key
              undefined, // Initial value
              undefined, // Custom storage handler (not needed since we are going to use the default -- localStorage)
              { getOnInit: syncOptions?.getOnInitialization }, // Optionally hydrate the atom with the value from localStorage on initialization (can result in hydration issues)
          )
        : atomWithBroadcast<TData | undefined>(key, undefined);

    syncedAtom.onMount = (setAtom) => {
        const queryObserver = apolloClient.subscribe({
            query: query,
            variables: queryVariables,
        });
        queryObserver.subscribe((result) => {
            const data = !!result.data ? result.data : undefined;

            if(data && !syncOptions?.preferLocal) {
                setAtom(data);
            }
        });
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
            await apolloClient.cache.updateQuery(
                {
                    query,
                    variables: queryVariables,
                },
                (old) => ({
                    ...old,
                    ...newValue,
                }),
            );
        },
    );

    return derivedAtom;
}
