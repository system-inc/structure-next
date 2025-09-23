// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PaginationInput, DataInteractionDatabasesDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useDataInteractionDatabasesRequest
export function useDataInteractionDatabasesRequest(
    pagination?: Partial<PaginationInput>,
    options?: InferUseGraphQlQueryOptions<typeof DataInteractionDatabasesDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query DataInteractionDatabases($pagination: PaginationInput!) {
                dataInteractionDatabases(pagination: $pagination) {
                    items {
                        databaseName
                    }
                    pagination {
                        itemIndex
                        itemIndexForPreviousPage
                        itemIndexForNextPage
                        itemsPerPage
                        itemsTotal
                        pagesTotal
                        page
                    }
                }
            }
        `),
        {
            pagination: {
                itemsPerPage: pagination?.itemsPerPage ?? 100,
                itemIndex: pagination?.itemIndex ?? 0,
                filters: pagination?.filters,
                orderBy: pagination?.orderBy,
            },
        },
        options,
    );
}
