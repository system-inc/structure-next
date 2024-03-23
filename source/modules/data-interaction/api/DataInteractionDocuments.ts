// Dependencies
import { graphql } from '@project/source/graphql/generated';

// Document - Databases Query
export const dataInteractionDatabasesQueryDocument = graphql(`
    query dataInteractionDatabasesQuery($pagination: PaginationInput) {
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
`);

// Document - Database Table Query
export const dataInteractionDatabaseTableQueryDocument = graphql(`
    query dataInteractionDatabaseTable($databaseName: String!, $tableName: String!) {
        dataInteractionDatabaseTable(databaseName: $databaseName, tableName: $tableName) {
            databaseName
            tableName
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
                type
                tableName
                inverseFieldName
                inverseType
                inverseTableName
            }
        }
    }
`);

// Document - Database Table Metrics
export const dataInteractionDatabaseTableMetricsQueryDocument = graphql(`
    query dataInteractionDatabaseTableMetricsQuery($input: DataInteractionDatabaseTableMetricsQueryInput!) {
        dataInteractionDatabaseTableMetrics(input: $input) {
            timeInterval
            data
        }
    }
`);

// Document - Database Tables Query
export const dataInteractionDatabaseTablesQueryDocument = graphql(`
    query dataInteractionDatabaseTablesQuery($databaseName: String, $pagination: PaginationInput) {
        dataInteractionDatabaseTables(databaseName: $databaseName, pagination: $pagination) {
            items {
                databaseName
                tableName
                rowCount
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
`);

// Document - Database Table Rows Query
export const dataInteractionDatabaseTableRowsQueryDocument = graphql(`
    query dataInteractionDatabaseTableRows(
        $databaseName: String!
        $tableName: String!
        $pagination: PaginationInput
        $orderBy: OrderBy
        $filters: ColumnFilterGroup
    ) {
        dataInteractionDatabaseTableRows(
            databaseName: $databaseName
            tableName: $tableName
            pagination: $pagination
            orderBy: $orderBy
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
`);
