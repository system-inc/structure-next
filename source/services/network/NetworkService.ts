'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - TanStack Query
import {
    useQuery as tanStackReactQueryUseQuery,
    useMutation as tanStackReactQueryUseMutation,
    useQueryClient as tanStackReactQueryUseQueryClient,
    useSuspenseQuery as tanStackReactQueryUseSuspenseQuery,
    QueryClient as tanStackReactQueryClient,
    QueryKey as CacheKey,
    keepPreviousData,
    Query,
} from '@tanstack/react-query';

// Dependencies - API
import {
    GraphQlResponseInterface,
    hasGraphQlErrors,
    parseGraphQlErrors,
} from '@structure/source/api/graphql/GraphQlUtilities';

// Dependencies - Internal
import { NetworkStatistics, NetworkRequestStatisticsInterface } from './internal/NetworkServiceStatistics';
import { AppOrStructureTypedDocumentString } from './internal/NetworkServiceGraphQl';
import { NetworkServiceDeviceId } from './internal/NetworkServiceDeviceId';

// Export GraphQL utilities
export { gql } from './internal/NetworkServiceGraphQl';
export type { AppOrStructureTypedDocumentString as AnyTypedDocumentString } from './internal/NetworkServiceGraphQl';

// Export statistics interface
export type { NetworkRequestStatisticsInterface } from './internal/NetworkServiceStatistics';

// Types
export interface UseRequestOptionsInterface<TData, TVariables = void> {
    // The async function to execute that fetches or mutates data
    request: (variables: TVariables) => Promise<TData>;
    // Unique identifier for caching - use array for cached queries, false for mutations
    cacheKey: CacheKey | false;
    // Callback function called when the request succeeds
    onSuccess?: (data: TData) => void;
    // Callback function called when the request fails
    onError?: (error: Error) => void;
    // Whether this query should execute - useful for dependent queries
    enabled?: boolean;
    // How long the data is considered fresh (won't refetch) in milliseconds
    validDurationInMilliseconds?: number;
    // How long to keep unused data in cache before garbage collection
    clearAfterUnusedDurationInMilliseconds?: number;
    // Automatically refresh data at this interval (false to disable)
    refreshIntervalInMilliseconds?: number | false;
    // Whether to refresh data when the window regains focus
    refreshOnWindowFocus?: boolean;
    // Number of retry attempts for failed requests (true = 3, false = 0)
    maximumRetries?: boolean | number;
    // Initial data to be set as the query's initial data
    initialData?: TData;
    // Placeholder data to show while the query is loading (not cached)
    placeholderData?: TData | (() => TData | undefined);
    // Keep previous data when query key changes (useful for pagination)
    keepPreviousData?: boolean;
}

// Base interface with common properties
interface UseRequestResultBase<TData> {
    data?: TData;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    cancel?: () => void;
}

// Query-specific result interface
export interface UseGraphQlQueryRequestResultInterface<TData> extends UseRequestResultBase<TData> {
    refresh: () => void;
    isRefreshing: boolean;
}

// Mutation-specific result interface
export interface UseGraphQlMutationRequestResultInterface<TData, TVariables = void>
    extends UseRequestResultBase<TData> {
    execute: (variables?: TVariables) => Promise<TData>;
    isPending: boolean;
    variables?: TVariables;
}

// Suspense query result interface (no loading/error states - those are handled by Suspense/ErrorBoundary)
export interface UseSuspenseRequestResultInterface<TData> {
    data: TData; // Always present in suspense queries
    refresh: () => void;
    isRefreshing: boolean;
    cancel: () => void;
}

// Interface - NetworkService Options
export interface NetworkServiceOptions {
    serverSide?: boolean;
    fetch?: typeof fetch;
}

// NetworkService class
export class NetworkService {
    private tanStackReactQueryClient: tanStackReactQueryClient;
    private options: NetworkServiceOptions;
    private statisticsManager: NetworkStatistics;
    private deviceIdManager: NetworkServiceDeviceId;

    constructor(options: NetworkServiceOptions = {}) {
        this.options = options;
        this.statisticsManager = new NetworkStatistics(this.isServerSide());
        this.deviceIdManager = new NetworkServiceDeviceId(this.isServerSide());
        this.tanStackReactQueryClient = new tanStackReactQueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 5 * 60 * 1000, // 5 minutes
                    gcTime: 10 * 60 * 1000, // 10 minutes
                    retry: 1,
                    refetchOnWindowFocus: false,
                },
                mutations: {
                    retry: 0,
                },
            },
        });
    }

    // Get the async client for provider setup
    getTanStackReactQueryClient(): tanStackReactQueryClient {
        return this.tanStackReactQueryClient;
    }

    // Check if running on server side
    private isServerSide(): boolean {
        return typeof window === 'undefined' || this.options.serverSide === true;
    }

    // Helper to calculate body size for statistics
    private getBodySize(body: BodyInit | null | undefined): number {
        if(!body) return 0;
        if(typeof body === 'string') return new Blob([body]).size;
        if(body instanceof Blob) return body.size;
        if(body instanceof ArrayBuffer) return body.byteLength;
        return 0;
    }

    // Helper to determine if URL is internal API
    private isInternalApiUrl(input: RequestInfo | URL): boolean {
        if(!ProjectSettings.apis?.base?.host) return false;

        const apiHost = ProjectSettings.apis.base.host;
        const baseDomain = apiHost.split('.').slice(-2).join('.');

        const getHostname = (url: string | URL | Request): string => {
            try {
                if(typeof url === 'string') return new URL(url).hostname;
                if(url instanceof URL) return url.hostname;
                if(url instanceof Request) return new URL(url.url).hostname;
                return '';
            } catch {
                return '';
            }
        };

        const hostname = getHostname(input);
        return hostname === apiHost || hostname.endsWith('.' + baseDomain);
    }

    // Helper to augment error with additional properties
    private augmentError<T extends Error>(error: T, properties: Record<string, unknown>): T {
        Object.assign(error, properties);
        return error;
    }

    // Helper to track and execute async operations
    private async trackAsyncOperation<T>(operation: () => Promise<T>): Promise<T> {
        const startTime = Date.now();
        this.statisticsManager.trackRequest();

        try {
            await this.deviceIdManager.ensure();
            const result = await operation();
            this.statisticsManager.trackSuccess(Date.now() - startTime);
            return result;
        }
        catch(error) {
            this.statisticsManager.trackError();
            throw error;
        } finally {
            this.statisticsManager.decrementActiveRequests();
        }
    }

    /**
     * Direct request method (fetch proxy with deviceId handling and smart credentials)
     *
     * Automatically includes credentials for internal API calls:
     * - Internal API calls get `credentials: 'include'`
     * - External API calls use browser default (`credentials: 'same-origin'`)
     * - Can be overridden by explicitly setting credentials in options
     */
    async request(input: RequestInfo | URL, options?: RequestInit): Promise<Response> {
        // Ensure deviceId before making the request
        await this.deviceIdManager.ensure();

        // Use custom fetch if provided (for Cloudflare worker-to-worker calls)
        const fetchMethod = this.options.fetch || fetch;

        // For server-side requests in production, transform the URL to use the Base worker-to-worker API
        let finalInput = input;
        if(this.options.serverSide && this.options.fetch) {
            // This is a special convention that tells Base to not create duplicate deviceIds for worker-to-worker requests
            finalInput =
                typeof input === 'string'
                    ? input.replace(/^https:\/\/[^/]+/, 'https://website.base-internal')
                    : input instanceof URL
                      ? new URL(input.toString().replace(/^https:\/\/[^/]+/, 'https://website.base-internal'))
                      : input;
        }

        // Determine if this is an internal API call
        const isInternalApi = this.isInternalApiUrl(input);

        // Build final options with smart credential defaults
        const finalOptions: RequestInit = {
            ...options,
            // Only set credentials if not explicitly provided
            ...(options?.credentials === undefined && isInternalApi
                ? { credentials: 'include' as RequestCredentials }
                : {}),
        };

        // Skip statistics tracking on server-side to avoid state pollution
        if(this.isServerSide()) {
            return fetchMethod(finalInput, finalOptions);
        }

        // Client-side path with full statistics tracking
        const startTime = Date.now();
        this.statisticsManager.trackRequest();

        try {
            // Track request size if body is provided
            if(options?.body) {
                this.statisticsManager.trackBytesSent(this.getBodySize(options.body));
            }

            // Make the actual request
            const response = await fetchMethod(finalInput, finalOptions);

            // Update statistics based on response
            if(response.ok) {
                this.statisticsManager.trackSuccess(Date.now() - startTime);
            }
            else {
                this.statisticsManager.trackError();
            }

            // Note: We can't easily track response size without consuming the body
            // The caller needs the response body, so we'll skip size tracking for direct requests

            return response;
        }
        catch(error) {
            this.statisticsManager.trackError();
            throw error;
        } finally {
            this.statisticsManager.decrementActiveRequests();
        }
    }

    // Direct GraphQL request method (for non-hook GraphQL requests)
    async graphQlRequest<TResult, TVariables = Record<string, never>>(
        query: AppOrStructureTypedDocumentString<TResult, TVariables>,
        variables?: TVariables,
        options?: { headers?: HeadersInit },
    ): Promise<TResult> {
        const graphqlEndpoint = ProjectSettings.apis?.base
            ? `https://${ProjectSettings.apis.base.host}${ProjectSettings.apis.base.graphQlPath}`
            : '/graphql';

        const body = JSON.stringify({ query: query.toString(), variables });

        // Use our request method which handles device ID, statistics, etc.
        const response = await this.request(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/graphql-response+json',
                ...options?.headers,
            },
            body,
        });

        const responseText = await response.text();

        // Skip statistics tracking on server-side to avoid state pollution
        if(!this.isServerSide()) {
            this.statisticsManager.trackBytesReceived(new Blob([responseText]).size);
        }

        // Parse response with proper typing
        const graphQlResponse = JSON.parse(responseText) as GraphQlResponseInterface<TResult>;

        // Check for network errors
        if(!response.ok) {
            throw this.augmentError(new Error(`Network request failed with status ${response.status}`), {
                status: response.status,
            });
        }

        // Check for GraphQL errors
        if(hasGraphQlErrors(graphQlResponse)) {
            const errorMessage = parseGraphQlErrors(graphQlResponse) || 'GraphQL request failed';
            const error = new Error(errorMessage);

            // Attach the full error details for better debugging
            throw this.augmentError(error, {
                graphQlErrors: graphQlResponse.errors || (graphQlResponse.error ? [graphQlResponse.error] : []),
                graphQlResponse,
            });
        }

        return graphQlResponse.data as TResult;
    }

    // Main hook with overloads
    useRequest<TData>(
        options: UseRequestOptionsInterface<TData, void> & { cacheKey: CacheKey },
    ): UseGraphQlQueryRequestResultInterface<TData>;
    useRequest<TData, TVariables = void>(
        options: UseRequestOptionsInterface<TData, TVariables> & { cacheKey: false },
    ): UseGraphQlMutationRequestResultInterface<TData, TVariables>;
    useRequest<TData, TVariables = void>(
        options: UseRequestOptionsInterface<TData, TVariables>,
    ): UseGraphQlQueryRequestResultInterface<TData> | UseGraphQlMutationRequestResultInterface<TData, TVariables> {
        const queryClient = tanStackReactQueryUseQueryClient();

        // If cacheKey is not false, we treat this as a query
        if(options.cacheKey !== false) {
            // Cached behavior (like useQuery)
            const baseQueryOptions = {
                queryKey: options.cacheKey,
                queryFn: () =>
                    this.trackAsyncOperation(() => (options.request as (variables?: unknown) => Promise<TData>)()),
                enabled: options.enabled,
                staleTime: options.validDurationInMilliseconds,
                gcTime: options.clearAfterUnusedDurationInMilliseconds,
                refetchInterval: options.refreshIntervalInMilliseconds,
                refetchOnWindowFocus: options.refreshOnWindowFocus,
                retry: options.maximumRetries,
                initialData: options.initialData,
            };

            // Build complete options with placeholderData if needed
            const completeQueryOptions = {
                ...baseQueryOptions,
                ...(options.keepPreviousData ? { placeholderData: keepPreviousData } : {}),
                ...(options.placeholderData !== undefined && !options.keepPreviousData
                    ? { placeholderData: options.placeholderData }
                    : {}),
            } as Parameters<typeof tanStackReactQueryUseQuery>[0];

            const queryResult = tanStackReactQueryUseQuery(completeQueryOptions, this.tanStackReactQueryClient);

            return {
                data: queryResult.data,
                error: queryResult.error,
                isLoading: queryResult.isLoading,
                isError: queryResult.isError,
                isSuccess: queryResult.isSuccess,
                refresh: queryResult.refetch,
                isRefreshing: queryResult.isRefetching,
                cancel: () => queryClient.cancelQueries({ queryKey: options.cacheKey as CacheKey }),
            } as UseGraphQlQueryRequestResultInterface<TData>;
        }
        else {
            // Non-cached behavior (like useMutation)
            const mutationResult = tanStackReactQueryUseMutation(
                {
                    mutationFn: (variables: TVariables) => this.trackAsyncOperation(() => options.request(variables)),
                    onSuccess: options.onSuccess,
                    onError: options.onError,
                },
                this.tanStackReactQueryClient,
            );

            return {
                data: mutationResult.data,
                error: mutationResult.error,
                isLoading: mutationResult.isPending,
                isError: mutationResult.isError,
                isSuccess: mutationResult.isSuccess,
                execute: mutationResult.mutateAsync,
                isPending: mutationResult.isPending,
                variables: mutationResult.variables,
                cancel: () => {
                    // Mutations don't have a built-in cancel, but we can track it
                    this.statisticsManager.trackCancellation();
                },
            } as UseGraphQlMutationRequestResultInterface<TData, TVariables>;
        }
    }

    // Suspense query method
    useSuspenseRequest<TData>(
        options: Omit<UseRequestOptionsInterface<TData, void>, 'enabled'> & { cacheKey: CacheKey },
    ): UseSuspenseRequestResultInterface<TData> {
        const queryClient = tanStackReactQueryUseQueryClient();

        const queryResult = tanStackReactQueryUseSuspenseQuery(
            {
                queryKey: options.cacheKey,
                queryFn: () => this.trackAsyncOperation(() => options.request()),
                staleTime: options.validDurationInMilliseconds,
                gcTime: options.clearAfterUnusedDurationInMilliseconds,
                refetchInterval: options.refreshIntervalInMilliseconds,
                refetchOnWindowFocus: options.refreshOnWindowFocus,
                retry: options.maximumRetries,
                initialData: options.initialData,
            },
            this.tanStackReactQueryClient,
        );

        return {
            data: queryResult.data,
            refresh: queryResult.refetch,
            isRefreshing: queryResult.isRefetching,
            cancel: () => queryClient.cancelQueries({ queryKey: options.cacheKey }),
        };
    }

    // GraphQL helpers
    useGraphQlQuery<TResult, TVariables>(
        query: AppOrStructureTypedDocumentString<TResult, TVariables>,
        ...[variables, options]: TVariables extends Record<string, never>
            ? [variables?: undefined, options?: Partial<UseRequestOptionsInterface<TResult, void>>]
            : [variables: TVariables, options?: Partial<UseRequestOptionsInterface<TResult, void>>]
    ) {
        return this.useRequest<TResult>({
            cacheKey: [query.toString(), variables],
            request: () => this.graphQlRequest(query, variables),
            ...options,
        } as UseRequestOptionsInterface<TResult, void> & { cacheKey: CacheKey });
    }

    useGraphQlMutation<TResult, TVariables>(
        mutation: AppOrStructureTypedDocumentString<TResult, TVariables>,
        options?: Partial<UseRequestOptionsInterface<TResult, TVariables>>,
    ) {
        return this.useRequest<TResult, TVariables>({
            cacheKey: false,
            request: (variables: TVariables) => this.graphQlRequest(mutation, variables),
            ...options,
        } as UseRequestOptionsInterface<TResult, TVariables> & { cacheKey: false });
    }

    // GraphQL suspense query helper
    useSuspenseGraphQlQuery<TResult, TVariables>(
        query: AppOrStructureTypedDocumentString<TResult, TVariables>,
        ...[variables, options]: TVariables extends Record<string, never>
            ? [variables?: undefined, options?: Partial<Omit<UseRequestOptionsInterface<TResult, void>, 'enabled'>>]
            : [variables: TVariables, options?: Partial<Omit<UseRequestOptionsInterface<TResult, void>, 'enabled'>>]
    ): UseSuspenseRequestResultInterface<TResult> {
        return this.useSuspenseRequest<TResult>({
            cacheKey: [query.toString(), variables],
            request: () => this.graphQlRequest(query, variables),
            ...options,
        } as Omit<UseRequestOptionsInterface<TResult, void>, 'enabled'> & { cacheKey: CacheKey });
    }

    // Cache management methods
    getCache<TData>(key: CacheKey): TData | undefined {
        return this.tanStackReactQueryClient.getQueryData<TData>(key);
    }

    setCache<TData>(key: CacheKey, data: TData): void {
        this.tanStackReactQueryClient.setQueryData(key, data);
    }

    invalidateCache(keys: CacheKey): Promise<void> {
        return this.tanStackReactQueryClient.invalidateQueries({ queryKey: keys });
    }

    removeCache(keys: CacheKey): void {
        this.tanStackReactQueryClient.removeQueries({ queryKey: keys });
    }

    resetCache(keys?: CacheKey): Promise<void> {
        if(keys) {
            return this.tanStackReactQueryClient.resetQueries({ queryKey: keys });
        }
        return this.tanStackReactQueryClient.resetQueries();
    }

    clearCache(): void {
        this.tanStackReactQueryClient.clear();
    }

    async prefetchCache<TData>(key: CacheKey, fn: () => Promise<TData>): Promise<void> {
        await this.tanStackReactQueryClient.prefetchQuery({
            queryKey: key,
            queryFn: async () => {
                await this.deviceIdManager.ensure();
                return fn();
            },
        });
    }

    async refreshAllRequests(): Promise<void> {
        return this.tanStackReactQueryClient.refetchQueries();
    }

    async refreshRequests(filters?: {
        type?: 'active' | 'inactive' | 'all';
        exact?: boolean;
        predicate?: (query: Query) => boolean;
        queryKey?: CacheKey;
    }): Promise<void> {
        return this.tanStackReactQueryClient.refetchQueries(filters);
    }

    async refreshActiveRequests(): Promise<void> {
        return this.refreshRequests({ type: 'active' });
    }

    // Statistics methods
    getStatistics(): NetworkRequestStatisticsInterface {
        return this.statisticsManager.getStatistics();
    }

    resetStatistics(): void {
        this.statisticsManager.resetStatistics();
    }
}

// Create singleton instance
export const networkService = new NetworkService();
