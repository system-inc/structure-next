'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Re-export graphql document builder for creating type-safe GraphQL queries/mutations
// This function parses GraphQL strings into typed documents that work with our NetworkService
export { graphql as gql } from '@structure/source/api/graphql/generated';

// Dependencies - TanStack Query
import {
    useQuery as tanStackReactQueryUseQuery,
    useMutation as tanStackReactQueryUseMutation,
    useQueryClient as tanStackReactQueryUseQueryClient,
    QueryClient as tanStackReactQueryClient,
    QueryKey as CacheKey,
} from '@tanstack/react-query';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - API
import {
    GraphQlResponseInterface,
    hasGraphQlErrors,
    parseGraphQlErrors,
} from '@structure/source/api/graphql/GraphQlUtilities';

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
}

export interface UseRequestResultInterface<TData, TVariables = void> {
    // Common properties
    data?: TData;
    error: Error | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;

    // Query-specific (when cacheKey is provided)
    refresh?: () => void;
    isRefreshing?: boolean;

    // Mutation-specific (when cacheKey is false)
    execute?: (variables: TVariables) => Promise<TData>;
    isPending?: boolean;

    // Request cancellation
    cancel?: () => void;
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

    // Main hook with overloads
    useRequest<TData>(
        options: UseRequestOptionsInterface<TData, void> & { cacheKey: CacheKey },
    ): UseRequestResultInterface<TData, void>;
    useRequest<TData, TVariables>(
        options: UseRequestOptionsInterface<TData, TVariables> & { cacheKey: false },
    ): UseRequestResultInterface<TData, TVariables>;
    useRequest<TData, TVariables = void>(
        options: UseRequestOptionsInterface<TData, TVariables>,
    ): UseRequestResultInterface<TData, TVariables> {
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
            };
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
                execute: mutationResult.mutateAsync,
                isPending: mutationResult.isPending,
                cancel: () => {
                    // Mutations don't have a built-in cancel, but we can track it
                    this.statistics.cancelledRequests++;
                },
            };
        }
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
                const bodySize = typeof init.body === 'string' 
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
            } else {
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

    // GraphQL helpers
    useGraphQlQuery<TData, TVariables = Record<string, unknown>>(
        query: string,
        variables?: TVariables,
        options?: Partial<UseRequestOptionsInterface<TData, void>>,
    ) {
        return this.useRequest<TData>({
            cacheKey: [query, variables],
            request: async () => {
                const response = await this.graphQlRequest<TData>(query, variables);
                return response;
            },
            ...options,
        } as UseRequestOptionsInterface<TData, void> & { cacheKey: CacheKey });
    }

    useGraphQlMutation<TData, TVariables = Record<string, unknown>>(
        mutation: string,
        options?: Partial<UseRequestOptionsInterface<TData, TVariables>>,
    ) {
        return this.useRequest<TData, TVariables>({
            cacheKey: false,
            request: async (variables: TVariables) => {
                const response = await this.graphQlRequest<TData>(mutation, variables);
                return response;
            },
            ...options,
        } as UseRequestOptionsInterface<TData, TVariables> & { cacheKey: false });
    }

    private async graphQlRequest<TData>(query: string, variables?: unknown): Promise<TData> {
        const graphqlEndpoint = ProjectSettings.apis?.base
            ? `https://${ProjectSettings.apis.base.host}${ProjectSettings.apis.base.graphQlPath}`
            : '/graphql';

        const body = JSON.stringify({ query, variables });
        this.statistics.totalBytesSent += new Blob([body]).size;

        const response = await fetch(graphqlEndpoint, {
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
        const graphQlResponse = JSON.parse(responseText) as GraphQlResponseInterface<TData>;

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

        return graphQlResponse.data as TData;
    }
}

// Create singleton instance
export const networkService = new NetworkService();
