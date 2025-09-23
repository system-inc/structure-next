// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { DataInteractionDatabaseTableDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useDataInteractionDatabaseTableRequest
export function useDataInteractionDatabaseTableRequest(
    databaseName: string,
    tableName: string,
    options?: InferUseGraphQlQueryOptions<typeof DataInteractionDatabaseTableDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query DataInteractionDatabaseTable($databaseName: String!, $tableName: String!) {
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
        `),
        {
            databaseName: databaseName,
            tableName: tableName,
        },
        options,
    );
}
