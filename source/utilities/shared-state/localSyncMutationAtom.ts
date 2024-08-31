import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { type DocumentNode, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';

export function localSyncMutationAtom<TData, TVariables extends OperationVariables | undefined>(
    localStorageId: string,
    mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
    syncOptions?: {
        getOnInitialization?: boolean;
        preferLocal?: boolean;
    },
) {
    const localStorageAtom = atomWithStorage<TData | undefined>(localStorageId, undefined, undefined, {
        getOnInit: syncOptions?.getOnInitialization,
    });

    const derivedAtom = atom(
        // Getter
        function (get) {
            return get(localStorageAtom);
        },
        // Setter
        async function (get, set, variables: TVariables) {
            try {
                const result = await apolloClient.mutate({
                    mutation,
                    variables,
                });

                if(result.data && !syncOptions?.preferLocal) {
                    set(localStorageAtom, result.data);
                }

                return result;
            }
            catch(error) {
                console.error('Mutation error:', error);
                throw error;
            }
        },
    );

    return derivedAtom;
}
