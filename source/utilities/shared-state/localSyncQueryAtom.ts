import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { type DocumentNode, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';

export function localSyncQueryAtom<TData, TVariables extends OperationVariables | undefined>(
    localStorageId: string,
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    queryVariables: TVariables | undefined,
    syncOptions: {
        getOnInitialization?: boolean;
        preferLocal?: boolean;
    },
) {
    const localStorageAtom = atomWithStorage<TData | undefined>(
        localStorageId, // Local storage key
        undefined, // Initial value
        undefined, // Custom storage handler (not needed since we are going to use the default -- localStorage)
        { getOnInit: syncOptions?.getOnInitialization }, // Optionally hydrate the atom with the value from localStorage on initialization (can result in hydration issues)
    );

    localStorageAtom.onMount = (setAtom) => {
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
        function (get) {
            const atomValue = get(localStorageAtom);
            return atomValue;
        },
        // Setter
        function (get, set, newValue: TData) {
            // Update the atom value
            set(localStorageAtom, newValue);
            // Update the Apollo cache
            apolloClient.cache.updateQuery(
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
