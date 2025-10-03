// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    PaginationInput,
    ColumnFilterGroupInput,
    DataInteractionDatabaseTableRowsDocument,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useDataInteractionDatabaseTableRowsRequest
export function useDataInteractionDatabaseTableRowsRequest(
    databaseName: string,
    tableName: string,
    pagination: PaginationInput,
    filters?: ColumnFilterGroupInput,
    options?: InferUseGraphQlQueryOptions<typeof DataInteractionDatabaseTableRowsDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query DataInteractionDatabaseTableRows(
                $databaseName: String!
                $tableName: String!
                $pagination: PaginationInput!
                $filters: ColumnFilterGroupInput
            ) {
                dataInteractionDatabaseTableRows(
                    databaseName: $databaseName
                    tableName: $tableName
                    pagination: $pagination
                    filters: $filters
                ) {
                    items
                    databaseName
                    tableName
                    rowCount
                    columns {
                        name
                        type
                        isKey
                        isPrimaryKey
                        keyTableName
                        possibleValues
                        isNullable
                        isGenerated
                        length
                    }
                    relations {
                        fieldName
                        tableName
                        type
                        inverseFieldName
                        inverseType
                        inverseTableName
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
            tableName: tableName,
            pagination: pagination,
            filters: filters,
        },
        {
            enabled: !!(databaseName && tableName),
            keepPreviousData: true,
            ...options,
        },
    );
}
