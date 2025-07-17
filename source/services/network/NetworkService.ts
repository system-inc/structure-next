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
} from '@tanstack/react-query';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - API
import {
    GraphQlResponseInterface,
    hasGraphQlErrors,
    parseGraphQlErrors,
} from '@structure/source/api/graphql/GraphQlUtilities';

/**
 * GraphQL Import Strategy
 *
 * We have two separate GraphQL code generation outputs:
 * 1. App-specific queries: /app/_api/graphql/generated/
 * 2. Structure queries: /libraries/structure/source/api/graphql/generated/
 *
 * NetworkService needs to handle both because:
 * - App code uses app-specific GraphQL queries (e.g., product queries, checkout, etc.)
 * - Structure code uses structure GraphQL queries (e.g., account management, posts, etc.)
 *
 * By importing both and creating a unified interface, NetworkService becomes the single
 * source of truth for all network operations, regardless of where the query was defined.
 *
 * The ESLint ignores below are necessary because NetworkService is a special case that
 * needs to bridge the app/structure boundary to provide a unified API.
 */

// Import both graphql functions from their respective generated locations
// eslint-disable-next-line structure/no-structure-project-imports-rule
import { graphql as appGraphQl } from '@project/app/_api/graphql/GraphQlGeneratedCode';
import { graphql as structureGraphQl } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Import TypedDocumentString types from both locations
// TypedDocumentString is a class that extends String and contains the GraphQL query along with its type information for full type safety
// eslint-disable-next-line structure/no-structure-project-imports-rule
import type { TypedDocumentString as AppTypedDocumentString } from '@project/app/_api/graphql/GraphQlGeneratedCode';
import type { TypedDocumentString as StructureTypedDocumentString } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Create a union type that accepts both TypedDocumentString types
// This allows our GraphQL methods to accept queries from either code generation output
type AnyTypedDocumentString<TResult, TVariables> =
    | StructureTypedDocumentString<TResult, TVariables>
    | AppTypedDocumentString<TResult, TVariables>;

/**
 * Unified GraphQL Template Tag (gql)
 *
 * This Proxy creates a single `gql` function that can handle GraphQL queries from both
 * app and structure generated code. It works by:
 *
 * 1. When used as a template tag: gql`query { ... }`
 *    - Tries app's graphql function first
 *    - Falls back to structure's graphql function if not found
 *
 * 2. When accessing pre-generated documents: gql.SomeDocument
 *    - Checks if the property exists in app's graphql exports
 *    - Falls back to structure's graphql exports if not found
 *
 * This approach allows us to:
 * - Use a single import: `import { gql } from '@structure/source/services/network/NetworkService'`
 * - Access queries from either code generation output transparently
 * - Maintain full TypeScript type safety for all queries
 *
 * Example usage:
 * ```typescript
 * // For inline queries (template tag)
 * const myQuery = gql`query GetUser { user { id name } }`;
 *
 * // For pre-generated typed documents
 * const result = await networkService.graphQlRequest(gql.GetUserDocument, variables);
 * ```
 * Export note: We export as 'gql' instead of 'graphql' to:
 * 1. Avoid naming conflicts with the original graphql imports
 * 2. Make it clear this is our unified NetworkService version
 */
export const gql = new Proxy(
    {},
    {
        get(target, property) {
            // Try app graphql first (for pre-generated documents)
            if(property in appGraphQl) {
                return (appGraphQl as unknown as Record<string | symbol, unknown>)[property];
            }
            // Fall back to structure graphql
            if(property in structureGraphQl) {
                return (structureGraphQl as unknown as Record<string | symbol, unknown>)[property];
            }
            // Handle function.apply calls for template tag usage
            if(property === 'apply') {
                return function (target: unknown, thisArgument: unknown, argumentsList: unknown[]) {
                    try {
                        // Use Function constructor to avoid ESLint warnings about spread
                        const appFunction = appGraphQl as unknown as (...args: unknown[]) => unknown;
                        return Function.prototype.apply.call(appFunction, null, argumentsList);
                    } catch {
                        const structureFunction = structureGraphQl as unknown as (...args: unknown[]) => unknown;
                        return Function.prototype.apply.call(structureFunction, null, argumentsList);
                    }
                };
            }
            return undefined;
        },
        // Handle direct function calls (template tag usage)
        apply(target, thisArgument, argumentsList) {
            try {
                // Use Function constructor to avoid ESLint warnings about spread
                const appFunction = appGraphQl as unknown as (...args: unknown[]) => unknown;
                return Function.prototype.apply.call(appFunction, null, argumentsList);
            } catch {
                const structureFunction = structureGraphQl as unknown as (...args: unknown[]) => unknown;
                return Function.prototype.apply.call(structureFunction, null, argumentsList);
            }
        },
    },
) as typeof appGraphQl & typeof structureGraphQl;

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
export interface UseQueryResultInterface<TData> extends UseRequestResultBase<TData> {
    refresh: () => void;
    isRefreshing: boolean;
}

// Mutation-specific result interface
export interface UseMutationResultInterface<TData, TVariables = void> extends UseRequestResultBase<TData> {
    execute: TVariables extends void 
        ? (() => Promise<TData>)
        : ((variables: TVariables) => Promise<TData>);
    isPending: boolean;
}

// For backward compatibility - will be removed in future
export type UseRequestResultInterface<TData, TVariables = void> = 
    UseQueryResultInterface<TData> | UseMutationResultInterface<TData, TVariables>;

// Suspense query result interface (no loading/error states - those are handled by Suspense/ErrorBoundary)
export interface UseSuspenseRequestResultInterface<TData> {
    data: TData; // Always present in suspense queries
    refresh: () => void;
    isRefreshing: boolean;
    cancel: () => void;
}

// Network Request Statistics Interface
export interface NetworkRequestStatisticsInterface {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    cancelledRequests: number;
    averageResponseTimeInMilliseconds: number | null;
    totalBytesReceived: number;
    totalBytesSent: number;
    activeRequests: number;
    cacheHits: number;
    cacheMisses: number;
    lastRequestAt: number | null;
    lastSuccessAt: number | null;
    lastErrorAt: number | null;
}

const deviceIdUpdatedAtKey = 'DeviceIdUpdatedAt';

// NetworkService class
class NetworkService {
    private tanStackReactQueryClient: tanStackReactQueryClient;
    private deviceIdPromise: Promise<void> | null = null;
    private deviceIdChecked = false;

    // Statistics tracking
    private statistics: NetworkRequestStatisticsInterface = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        cancelledRequests: 0,
        averageResponseTimeInMilliseconds: null,
        totalBytesReceived: 0,
        totalBytesSent: 0,
        activeRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        lastRequestAt: null,
        lastSuccessAt: null,
        lastErrorAt: null,
    };
    private responseTimes: number[] = [];

    constructor() {
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

    // Device ID management
    private async ensureDeviceId(): Promise<void> {
        // Skip deviceId check if accounts module is disabled
        if(!ProjectSettings.modules?.accounts) {
            return;
        }

        // If already checked this session, skip
        if(this.deviceIdChecked) return;

        // If already checking, return the same promise
        if(this.deviceIdPromise) return this.deviceIdPromise;

        // Start the check
        this.deviceIdPromise = this.checkAndRequestDeviceId();

        try {
            await this.deviceIdPromise;
            this.deviceIdChecked = true;
        } finally {
            this.deviceIdPromise = null;
        }
    }

    private async checkAndRequestDeviceId(): Promise<void> {
        const deviceIdUpdatedAt = localStorageService.get<number>(deviceIdUpdatedAtKey);
        const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000;
        const sixMonthsAgo = Date.now() - sixMonthsInMilliseconds;

        if(deviceIdUpdatedAt && deviceIdUpdatedAt > sixMonthsAgo) {
            // Valid deviceId exists
            return;
        }

        // Fetch deviceId with retries
        let lastError: Error | null = null;

        for(let attempt = 0; attempt < 3; attempt++) {
            try {
                // Build the deviceId endpoint URL
                const deviceIdUrl = ProjectSettings.apis?.base
                    ? `https://${ProjectSettings.apis.base.host}/graphql/deviceId`
                    : '/graphql/deviceId';

                const response = await fetch(deviceIdUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: '{ deviceId }' }),
                });

                if(response.ok) {
                    localStorageService.set<number>(deviceIdUpdatedAtKey, Date.now());
                    return;
                }

                lastError = new Error(`DeviceId fetch failed with status: ${response.status}`);
            }
            catch(error) {
                lastError = error as Error;
            }

            // If not the last attempt, wait with exponential backoff
            if(attempt < 2) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }

        // If all retries failed, log the error but continue
        // This allows requests to proceed even if deviceId fetch fails
        console.warn('Failed to fetch deviceId after 3 attempts:', lastError);
    }

    // Direct request method (fetch proxy with deviceId handling)
    async request(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        // Ensure deviceId before making the request
        await this.ensureDeviceId();

        const startTime = Date.now();
        this.statistics.totalRequests++;
        this.statistics.activeRequests++;
        this.statistics.lastRequestAt = startTime;

        try {
            // Track request size if body is provided
            if(init?.body) {
                const bodySize =
                    typeof init.body === 'string'
                        ? new Blob([init.body]).size
                        : init.body instanceof Blob
                          ? init.body.size
                          : init.body instanceof ArrayBuffer
                            ? init.body.byteLength
                            : 0;
                this.statistics.totalBytesSent += bodySize;
            }

            // Make the actual request
            const response = await fetch(input, init);

            // Update statistics based on response
            if(response.ok) {
                this.statistics.successfulRequests++;
                this.statistics.lastSuccessAt = Date.now();
            }
            else {
                this.statistics.failedRequests++;
                this.statistics.lastErrorAt = Date.now();
            }

            this.updateResponseTime(Date.now() - startTime);

            // Note: We can't easily track response size without consuming the body
            // The caller needs the response body, so we'll skip size tracking for direct requests

            return response;
        }
        catch(error) {
            // Update error statistics
            this.statistics.failedRequests++;
            this.statistics.lastErrorAt = Date.now();
            throw error;
        } finally {
            this.statistics.activeRequests--;
        }
    }

    // Direct GraphQL request method (for non-hook GraphQL requests)
    async graphQlRequest<TResult, TVariables = Record<string, never>>(
        query: AnyTypedDocumentString<TResult, TVariables>,
        variables?: TVariables,
    ): Promise<TResult> {
        const graphqlEndpoint = ProjectSettings.apis?.base
            ? `https://${ProjectSettings.apis.base.host}${ProjectSettings.apis.base.graphQlPath}`
            : '/graphql';

        const body = JSON.stringify({ query: query.toString(), variables });

        // Use our request method which handles deviceId, statistics, etc.
        const response = await this.request(graphqlEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/graphql-response+json',
            },
            body,
            credentials: 'include',
        });

        const responseText = await response.text();
        this.statistics.totalBytesReceived += new Blob([responseText]).size;

        // Parse response with proper typing
        const graphQlResponse = JSON.parse(responseText) as GraphQlResponseInterface<TResult>;

        // Check for network errors
        if(!response.ok) {
            const error = new Error(`Network request failed with status ${response.status}`);
            (error as { status?: number }).status = response.status;
            throw error;
        }

        // Check for GraphQL errors
        if(hasGraphQlErrors(graphQlResponse)) {
            const errorMessage = parseGraphQlErrors(graphQlResponse) || 'GraphQL request failed';
            const error = new Error(errorMessage);

            // Attach the full error details for better debugging
            (error as { graphQlErrors?: unknown; graphQlResponse?: unknown }).graphQlErrors =
                graphQlResponse.errors || (graphQlResponse.error ? [graphQlResponse.error] : []);
            (error as { graphQlErrors?: unknown; graphQlResponse?: unknown }).graphQlResponse = graphQlResponse;

            throw error;
        }

        return graphQlResponse.data as TResult;
    }

    // Main hook with overloads
    useRequest<TData>(
        options: UseRequestOptionsInterface<TData, void> & { cacheKey: CacheKey },
    ): UseQueryResultInterface<TData>;
    useRequest<TData, TVariables = void>(
        options: UseRequestOptionsInterface<TData, TVariables> & { cacheKey: false },
    ): UseMutationResultInterface<TData, TVariables>;
    useRequest<TData, TVariables = void>(
        options: UseRequestOptionsInterface<TData, TVariables>,
    ): UseQueryResultInterface<TData> | UseMutationResultInterface<TData, TVariables> {
        const queryClient = tanStackReactQueryUseQueryClient();

        if(options.cacheKey !== false) {
            // Cached behavior (like useQuery)
            const queryResult = tanStackReactQueryUseQuery(
                {
                    queryKey: options.cacheKey,
                    queryFn: async () => {
                        const startTime = Date.now();
                        this.statistics.totalRequests++;
                        this.statistics.activeRequests++;
                        this.statistics.lastRequestAt = startTime;

                        try {
                            await this.ensureDeviceId();
                            const result = await (options.request as (variables?: unknown) => Promise<TData>)();

                            // Update success statistics
                            this.statistics.successfulRequests++;
                            this.statistics.lastSuccessAt = Date.now();
                            this.updateResponseTime(Date.now() - startTime);

                            return result;
                        }
                        catch(error) {
                            // Update error statistics
                            this.statistics.failedRequests++;
                            this.statistics.lastErrorAt = Date.now();
                            throw error;
                        } finally {
                            this.statistics.activeRequests--;
                        }
                    },
                    enabled: options.enabled,
                    staleTime: options.validDurationInMilliseconds,
                    gcTime: options.clearAfterUnusedDurationInMilliseconds,
                    refetchInterval: options.refreshIntervalInMilliseconds,
                    refetchOnWindowFocus: options.refreshOnWindowFocus,
                    retry: options.maximumRetries,
                    initialData: options.initialData,
                    placeholderData: options.keepPreviousData ? keepPreviousData : options.placeholderData,
                },
                this.tanStackReactQueryClient,
            );

            return {
                data: queryResult.data,
                error: queryResult.error,
                isLoading: queryResult.isLoading,
                isError: queryResult.isError,
                isSuccess: queryResult.isSuccess,
                refresh: queryResult.refetch,
                isRefreshing: queryResult.isRefetching,
                cancel: () => queryClient.cancelQueries({ queryKey: options.cacheKey as CacheKey }),
            } as UseQueryResultInterface<TData>;
        }
        else {
            // Non-cached behavior (like useMutation)
            const mutationResult = tanStackReactQueryUseMutation(
                {
                    mutationFn: async (variables: TVariables) => {
                        const startTime = Date.now();
                        this.statistics.totalRequests++;
                        this.statistics.activeRequests++;
                        this.statistics.lastRequestAt = startTime;

                        try {
                            await this.ensureDeviceId();
                            const result = await options.request(variables);

                            // Update success statistics
                            this.statistics.successfulRequests++;
                            this.statistics.lastSuccessAt = Date.now();
                            this.updateResponseTime(Date.now() - startTime);

                            return result;
                        }
                        catch(error) {
                            // Update error statistics
                            this.statistics.failedRequests++;
                            this.statistics.lastErrorAt = Date.now();
                            throw error;
                        } finally {
                            this.statistics.activeRequests--;
                        }
                    },
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
                execute: mutationResult.mutateAsync as TVariables extends void 
                    ? (() => Promise<TData>)
                    : ((variables: TVariables) => Promise<TData>),
                isPending: mutationResult.isPending,
                cancel: () => {
                    // Mutations don't have a built-in cancel, but we can track it
                    this.statistics.cancelledRequests++;
                },
            } as UseMutationResultInterface<TData, TVariables>;
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
                queryFn: async () => {
                    const startTime = Date.now();
                    this.statistics.totalRequests++;
                    this.statistics.activeRequests++;
                    this.statistics.lastRequestAt = startTime;

                    try {
                        await this.ensureDeviceId();
                        const result = await options.request();

                        // Update success statistics
                        this.statistics.successfulRequests++;
                        this.statistics.lastSuccessAt = Date.now();
                        this.updateResponseTime(Date.now() - startTime);

                        return result;
                    }
                    catch(error) {
                        // Update error statistics
                        this.statistics.failedRequests++;
                        this.statistics.lastErrorAt = Date.now();
                        throw error;
                    } finally {
                        this.statistics.activeRequests--;
                    }
                },
                staleTime: options.validDurationInMilliseconds,
                gcTime: options.clearAfterUnusedDurationInMilliseconds,
                refetchInterval: options.refreshIntervalInMilliseconds,
                refetchOnWindowFocus: options.refreshOnWindowFocus,
                retry: options.maximumRetries,
                initialData: options.initialData,
                placeholderData: options.keepPreviousData ? keepPreviousData : options.placeholderData,
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
        query: AnyTypedDocumentString<TResult, TVariables>,
        ...[variables, options]: TVariables extends Record<string, never>
            ? [variables?: undefined, options?: Partial<UseRequestOptionsInterface<TResult, void>>]
            : [variables: TVariables, options?: Partial<UseRequestOptionsInterface<TResult, void>>]
    ) {
        return this.useRequest<TResult>({
            cacheKey: [query.toString(), variables],
            request: async () => {
                const response = await this.graphQlRequest(query, variables);
                return response;
            },
            ...options,
        } as UseRequestOptionsInterface<TResult, void> & { cacheKey: CacheKey });
    }

    useGraphQlMutation<TResult, TVariables>(
        mutation: AnyTypedDocumentString<TResult, TVariables>,
        options?: Partial<UseRequestOptionsInterface<TResult, TVariables>>,
    ) {
        return this.useRequest<TResult, TVariables>({
            cacheKey: false,
            request: async (variables: TVariables) => {
                const response = await this.graphQlRequest(mutation, variables);
                return response;
            },
            ...options,
        } as UseRequestOptionsInterface<TResult, TVariables> & { cacheKey: false });
    }

    // GraphQL suspense query helper
    useSuspenseGraphQlQuery<TResult, TVariables>(
        query: AnyTypedDocumentString<TResult, TVariables>,
        ...[variables, options]: TVariables extends Record<string, never>
            ? [variables?: undefined, options?: Partial<Omit<UseRequestOptionsInterface<TResult, void>, 'enabled'>>]
            : [variables: TVariables, options?: Partial<Omit<UseRequestOptionsInterface<TResult, void>, 'enabled'>>]
    ): UseSuspenseRequestResultInterface<TResult> {
        return this.useSuspenseRequest<TResult>({
            cacheKey: [query.toString(), variables],
            request: async () => {
                const response = await this.graphQlRequest(query, variables);
                return response;
            },
            ...options,
        } as Omit<UseRequestOptionsInterface<TResult, void>, 'enabled'> & { cacheKey: CacheKey });
    }

    // Cache management methods
    invalidateCache(keys: CacheKey): Promise<void> {
        return this.tanStackReactQueryClient.invalidateQueries({ queryKey: keys });
    }

    setCache<TData>(key: CacheKey, data: TData): void {
        this.tanStackReactQueryClient.setQueryData(key, data);
    }

    getCache<TData>(key: CacheKey): TData | undefined {
        return this.tanStackReactQueryClient.getQueryData<TData>(key);
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

    // Clear all cache
    clearCache(): void {
        this.tanStackReactQueryClient.clear();
    }

    // Prefetch data
    async prefetchCache<TData>(key: CacheKey, fn: () => Promise<TData>): Promise<void> {
        await this.tanStackReactQueryClient.prefetchQuery({
            queryKey: key,
            queryFn: async () => {
                await this.ensureDeviceId();
                return fn();
            },
        });
    }

    // Statistics methods
    private updateResponseTime(responseTimeInMilliseconds: number): void {
        this.responseTimes.push(responseTimeInMilliseconds);

        // Keep only last 100 response times to prevent memory leak
        if(this.responseTimes.length > 100) {
            this.responseTimes.shift();
        }

        // Update average
        const sum = this.responseTimes.reduce((acc, time) => acc + time, 0);
        this.statistics.averageResponseTimeInMilliseconds = Math.round(sum / this.responseTimes.length);
    }

    getStatistics(): NetworkRequestStatisticsInterface {
        return { ...this.statistics };
    }

    resetStatistics(): void {
        this.statistics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            cancelledRequests: 0,
            averageResponseTimeInMilliseconds: null,
            totalBytesReceived: 0,
            totalBytesSent: 0,
            activeRequests: 0,
            cacheHits: 0,
            cacheMisses: 0,
            lastRequestAt: null,
            lastSuccessAt: null,
            lastErrorAt: null,
        };
        this.responseTimes = [];
    }
}

// Create singleton instance
export const networkService = new NetworkService();
