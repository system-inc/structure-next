// Dependencies - API
import {
    networkService,
    InferUseGraphQlQueryOptions,
    AnyTypedDocumentString,
} from '@structure/source/services/network/NetworkService';

// Hook - useTimeSeriesDataRequest
export function useTimeSeriesDataRequest<TDocument extends AnyTypedDocumentString<unknown, unknown>>(
    query: TDocument,
    variables?: Record<string, unknown>,
    options?: InferUseGraphQlQueryOptions<TDocument>,
) {
    return networkService.useGraphQlQuery(query, variables || {}, options);
}
