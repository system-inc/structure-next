import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { type DocumentNode, type OperationVariables, type TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';
import { atomWithBroadcast } from './atomWithBroadcast';

export function localSyncMutationAtom<TData, TVariables extends OperationVariables | undefined>(
    key: string,
    mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
    variables: TVariables | undefined,
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
              { getOnInit: syncOptions?.getOnInitialization }, // Optionally hydrate the atom with the value from localStorage on initialization
          )
        : atomWithBroadcast<TData | undefined>(key, undefined);

    syncedAtom.onMount = (setAtom) => {
        const subscriber = apolloClient.watchQuery({
            query: mutation,
            variables: variables,
        });

        const subscription = subscriber.subscribe((result) => {
            const data = !!result.data ? result.data : undefined;

            if(data && !syncOptions?.preferLocal) {
                setAtom(data);
            }
        });

        return subscription.unsubscribe;
    };

    const derivedAtom = atom(
        // Getter
        async function (get) {
            return await get(syncedAtom);
        },
        // Setter
        async function (get, set, variables: TVariables) {
            try {
                const result = await apolloClient.mutate({
                    mutation,
                    variables,
                });

                if(result.data && !syncOptions?.preferLocal) {
                    set(syncedAtom, result.data);
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
