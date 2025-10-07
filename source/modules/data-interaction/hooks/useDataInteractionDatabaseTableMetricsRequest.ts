// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    DataInteractionDatabaseTableMetricsDocument,
    DataInteractionDatabaseTableMetricsQueryInput,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useDataInteractionDatabaseTableMetricsRequest
export function useDataInteractionDatabaseTableMetricsRequest(
    input: DataInteractionDatabaseTableMetricsQueryInput,
    options?: InferUseGraphQlQueryOptions<typeof DataInteractionDatabaseTableMetricsDocument>,
) {
    // Get the user's timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return networkService.useGraphQlQuery(
        gql(`
            query DataInteractionDatabaseTableMetrics($input: DataInteractionDatabaseTableMetricsQueryInput!) {
                dataInteractionDatabaseTableMetrics(input: $input) {
                    timeInterval
                    data
                }
            }
        `),
        {
            input: {
                ...input,
                timeZone,
            },
        },
        options,
    );
}
