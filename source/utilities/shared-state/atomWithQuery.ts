import { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@structure/source/api/Apollo';
import { Getter, atom } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { Subject } from 'rxjs';
import { globalStore } from './SharedStateProvider';

type QueryParams<TData, TVariables> = {
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
    queryVariables?: TVariables | undefined;
    skip?: boolean;
};

export function atomWithQuery<TData, TVariables extends OperationVariables | undefined>(
    getQueryParams: (get: Getter) => QueryParams<TData, TVariables>,
    intialValue?: TData,
) {
    const queryParamsAtom = atom(getQueryParams);

    // Create an atom that will hold the observable
    const observerAtom = atomWithObservable<TData | undefined>(
        (get) => {
            const { query, queryVariables, skip } = get(queryParamsAtom);

            const subject = new Subject<TData | undefined>();

            // Ensure we are on the client -- Otherwise, we will get authentication errors on the server due to http-only cookies
            if(typeof window !== 'undefined') {
                // If we are skipping the query, return an empty observable
                if(skip) {
                    subject.next(undefined);
                    subject.complete();
                }
                else {
                    apolloClient
                        .watchQuery({
                            query: query,
                            variables: queryVariables,
                        })
                        .subscribe({
                            start: () => {
                                // console.log('Query started');
                            },
                            next: (result) => {
                                const data = result.data;
                                if(data) subject.next(data);
                                else {
                                    console.error(result.error?.message ?? 'No data returned from query');
                                }
                            },
                            error: (error) => {
                                console.error(error);
                            },
                            complete: () => {
                                subject.complete();
                            },
                        });
                }
            }

            return subject;
        },
        {
            initialValue: intialValue,
        },
    );

    observerAtom.onMount = () => {
        const { query, queryVariables, skip } = globalStore.get(queryParamsAtom);

        // Run the query to hydrate the observable
        if(!skip) {
            apolloClient.query({
                query: query,
                variables: queryVariables,
            });
        }
    };

    return observerAtom;
}
