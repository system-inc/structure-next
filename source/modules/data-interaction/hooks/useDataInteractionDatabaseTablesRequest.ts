// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    PaginationInput,
    DataInteractionDatabaseTablesDocument,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useDataInteractionDatabaseTablesRequest
export function useDataInteractionDatabaseTablesRequest(
    databaseName: string,
    pagination?: Partial<PaginationInput>,
    options?: InferUseGraphQlQueryOptions<typeof DataInteractionDatabaseTablesDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query DataInteractionDatabaseTables($databaseName: String!, $pagination: PaginationInput!) {
                dataInteractionDatabaseTables(databaseName: $databaseName, pagination: $pagination) {
                    items {
                        databaseName
                        tableName
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
            databaseName: databaseName,
            pagination: {
                itemsPerPage: pagination?.itemsPerPage ?? 1000,
                itemIndex: pagination?.itemIndex ?? 0,
                filters: pagination?.filters,
                orderBy: pagination?.orderBy,
            },
        },
        options,
    );
}
