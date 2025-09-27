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
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

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

// Constants
export const networkServiceCacheKey = `${ProjectSettings.identifier}NetworkServiceCache`;

// Export GraphQL utilities
export { gql } from './internal/NetworkServiceGraphQl';
export type { AppOrStructureTypedDocumentString as AnyTypedDocumentString } from './internal/NetworkServiceGraphQl';

// Export statistics interface
export type { NetworkRequestStatisticsInterface } from './internal/NetworkServiceStatistics';

// Base options shared by both queries and mutations
interface UseRequestOptionsBase<TData, TVariables = void, TSelected = TData> {
    // The async function to execute that fetches or mutates data
    request: (variables: TVariables) => Promise<TData>;
    // Transform or select part of the data (affects returned data but not cache)
    select?: (data: TData) => TSelected;
    // Whether this request should execute - useful for dependent requests
    enabled?: boolean;
    // Number of retry attempts for failed requests (true = 3, false = 0)
    maximumRetries?: boolean | number;
    // Attach metadata to the request for debugging, logging, or filtering
    metadata?: Record<string, unknown>;
}

// Read-specific options (queries)
// Queries always have a cache key and can control caching behavior
// onSuccess and onError are intentionally omitted when using queries
// because they lead to confusing behavior. Instead, handle success/error states
// using effects or directly in your request function
export interface UseReadRequestOptionsInterface<TData, TVariables = void, TSelected = TData>
    extends UseRequestOptionsBase<TData, TVariables, TSelected> {
    /**
     * Cache control - determines where and how to cache query results:
     *
     * @default 'Memory'
     *
     * - `false`: No caching at all, always fetch fresh from network
     *   Use for: real-time data, sensitive data that shouldn't be cached
     *
     * - `'Memory'`: Cache in memory only (default behavior)
     *   Use for: standard queries that don't need to survive page refresh
     *   Cleared: On page refresh or tab close
     *
     * - `'SessionStorage'`: Cache in memory + persist to sessionStorage
     *   Use for: Data that should survive page refresh but not tab close
     *   Cleared: When the tab is closed
     *   Scope: Per-tab storage, not shared across tabs
     *
     * - `'LocalStorage'`: Cache in memory + persist to localStorage
     *   Use for: User preferences, account data, or other data that should persist
     *   Cleared: Only when explicitly cleared or cache expires
     *   Scope: Shared across all tabs and windows
     *
     * @example
     * // Real-time data that should never be cached
     * { cache: false }
     *
     * @example
     * // User account data that should persist across sessions
     * { cache: 'LocalStorage', validDurationInMilliseconds: Infinity }
     *
     * @example
     * // Form draft that should survive refresh but not tab close
     * { cache: 'SessionStorage' }
     */
    cache?: false | 'Memory' | 'SessionStorage' | 'LocalStorage';
    // Unique identifier for caching - required for all queries to identify and deduplicate requests
    cacheKey: CacheKey;
    // How long the data is considered fresh (won't refetch) in milliseconds
    validDurationInMilliseconds?: number;
    // How long to keep unused data in cache before garbage collection
    clearAfterUnusedDurationInMilliseconds?: number;
    // Automatically refresh data at this interval (false to disable)
    refreshIntervalInMilliseconds?: number | false;
    // Whether to continue refresh intervals when tab/window is in background
    refreshIntervalInBackground?: boolean;
    // Whether to refresh data when the window regains focus
    refreshOnWindowFocus?: boolean;
    // Whether to refresh data when reconnecting to the internet
    refreshOnReconnect?: boolean;
    // Initial data to be set as the query's initial data
    initialData?: TData;
    // Placeholder data to show while the query is loading (not cached)
    placeholderData?: TData | (() => TData | undefined);
    // Keep previous data when query key changes (useful for pagination)
    keepPreviousData?: boolean;
}

// Write-specific options (mutations)
// Mutations are for operations that modify data on the server
// They are never cached and are executed manually via execute()
export interface UseWriteRequestOptionsInterface<TData, TVariables = void, TSelected = TData>
    extends UseRequestOptionsBase<TData, TVariables, TSelected> {
    // Mutations don't have a cache key - they are never cached
    // Removing cacheKey entirely makes it clear this is a mutation
    // Callback function called when the request succeeds
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
    // Callback function called when the request fails
    onError?: (error: Error) => void;
    // Cache keys to invalidate when the mutation succeeds
    // Can be an array of keys or a function that returns keys based on variables
    invalidateOnSuccess?: CacheKey[] | ((variables: TVariables) => CacheKey[]);
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

// Utility type to infer useGraphQlQuery options from a generated Document type
export type InferUseGraphQlQueryOptions<TDocument> = TDocument extends AppOrStructureTypedDocumentString<
    infer TResult,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer TVariables // Infer but don't use
>
    ? Partial<UseReadRequestOptionsInterface<TResult, void>>
    : never;

// Utility type to infer useGraphQlMutation options from a generated Document type
export type InferUseGraphQlMutationOptions<TDocument> = TDocument extends AppOrStructureTypedDocumentString<
    infer TResult,
    infer TVariables
>
    ? Partial<UseWriteRequestOptionsInterface<TResult, TVariables>>
    : never;

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
                    retry: function (failureCount, error) {
                        // Don't retry on 4xx HTTP errors (client errors like 401, 403, 404)
                        if(error instanceof Error && 'status' in error) {
                            const status = (error as Error & { status: number }).status;
                            if(status >= 400 && status < 500) {
                                return false;
                            }
                        }

                        // Don't retry on GraphQL errors with 4xx status codes
                        if(error instanceof Error && 'graphQlErrors' in error) {
                            const graphQlErrors = (
                                error as Error & { graphQlErrors: Array<{ extensions?: { status?: number } }> }
                            ).graphQlErrors;
                            if(
                                graphQlErrors?.some(function (graphQlError) {
                                    const status = graphQlError.extensions?.status;
                                    return status !== undefined && status >= 400 && status < 500;
                                })
                            ) {
                                return false;
                            }
                        }

                        // For other errors, use default retry logic (respects maximumRetries)
                        return failureCount < 1; // Default was retry: 1
                    },
                    refetchOnWindowFocus: false,
                },
                mutations: {
                    retry: 0,
                },
            },
        });

        // Initialize persistence if in browser environment
        if(!this.isServerSide()) {
            // Helper to initialize persistence for a storage type
            const initializePersistence = (storageType: 'LocalStorage' | 'SessionStorage') => {
                // Create async storage adapter with error handling
                const createAsyncStorageAdapter = function (storage: Storage) {
                    return {
                        getItem: async function (key: string) {
                            try {
                                return storage.getItem(key);
                            }
                            catch(error) {
                                console.warn(`[NetworkService] Failed to read from ${storageType}:`, error);
                                return null;
                            }
                        },
                        setItem: async function (key: string, value: string) {
                            try {
                                storage.setItem(key, value);
                                const size = new Blob([value]).size;
                                console.log(
                                    `[NetworkService] Persisted ${(size / 1024).toFixed(2)}KB to ${storageType}`,
                                );
                            }
                            catch(error) {
                                console.warn(`[NetworkService] Failed to persist to ${storageType}:`, error);
                            }
                        },
                        removeItem: async function (key: string) {
                            try {
                                storage.removeItem(key);
                            }
                            catch(error) {
                                console.warn(`[NetworkService] Failed to remove from ${storageType}:`, error);
                            }
                        },
                    };
                };

                // Get the appropriate storage object
                let storage: Storage;
                if(storageType === 'LocalStorage') {
                    storage = window.localStorage;
                }
                else {
                    storage = window.sessionStorage;
                }

                // Create persister with the storage adapter
                const persister = createAsyncStoragePersister({
                    storage: createAsyncStorageAdapter(storage),
                    key: networkServiceCacheKey,
                });

                // Configure persistence for this storage type
                persistQueryClient({
                    queryClient: this.tanStackReactQueryClient,
                    persister,
                    maxAge: Infinity, // No expiration, let staleTime handle freshness
                    dehydrateOptions: {
                        shouldDehydrateQuery: (query) => query.meta?.cache === storageType,
                    },
                });
            };

            // Initialize both storage persisters
            initializePersistence('LocalStorage');
            initializePersistence('SessionStorage');
        }
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

        const apiHost = ProjectSettings.apis.base.host;
        const apiBaseDomain = apiHost
            .split('.')
            .slice(-2)
            .join('.') // strip off any subdomains
            .replace(/^\[|\]$/g, '') // remove IPv6 brackets
            .replace(/:\d+$/, ''); // remove port if present

        const inputHostname = getHostname(input);
        return inputHostname === apiHost || inputHostname.endsWith('.' + apiBaseDomain);
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
            const errorMessage = parseGraphQlErrors(graphQlResponse)?.message || 'GraphQL request failed';
            const error = new Error(errorMessage);

            // Attach the full error details for better debugging
            throw this.augmentError(error, {
                graphQlErrors: graphQlResponse.errors || (graphQlResponse.error ? [graphQlResponse.error] : []),
                graphQlResponse,
            });
        }

        return graphQlResponse.data as TResult;
    }

    // Read request hook - for fetching/reading data from the server
    // Always returns a result with refresh() method for re-fetching
    // Supports both cached and uncached reads via the 'cache' option
    useReadRequest<TData, TVariables = void, TSelected = TData>(
        options: UseReadRequestOptionsInterface<TData, TVariables, TSelected>,
    ): UseGraphQlQueryRequestResultInterface<TSelected> {
        const queryClient = tanStackReactQueryUseQueryClient();

        // Handle the cache option - defaults to 'Memory'
        const cacheMode = options.cache ?? 'Memory';

        // Determine if we should use TanStack cache at all
        const shouldCache = cacheMode !== false;

        // Configure TanStack Query options based on cache mode
        const cacheConfiguration = shouldCache
            ? {
                  // Normal caching behavior
                  staleTime: options.validDurationInMilliseconds,
                  gcTime: options.clearAfterUnusedDurationInMilliseconds,
              }
            : {
                  // cache: false behavior - always fetch fresh
                  staleTime: 0,
                  gcTime: 0,
              };

        // Add meta to track which storage type for persistence
        const queryMeta = {
            ...options.metadata,
            cache: cacheMode === 'SessionStorage' || cacheMode === 'LocalStorage' ? cacheMode : undefined,
        };

        const baseQueryOptions = {
            queryKey: options.cacheKey,
            queryFn: () =>
                this.trackAsyncOperation(() => (options.request as (variables?: unknown) => Promise<TData>)()),
            enabled: options.enabled,
            ...cacheConfiguration, // Apply cache configuration
            refetchInterval: options.refreshIntervalInMilliseconds,
            refetchIntervalInBackground: options.refreshIntervalInBackground,
            refetchOnWindowFocus: options.refreshOnWindowFocus,
            refetchOnReconnect: options.refreshOnReconnect,
            ...(options.maximumRetries !== undefined ? { retry: options.maximumRetries } : {}),
            initialData: options.initialData,
            select: options.select,
            meta: queryMeta,
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
            cancel: () => queryClient.cancelQueries({ queryKey: options.cacheKey }),
        } as UseGraphQlQueryRequestResultInterface<TSelected>;
    }

    // Write request hook - for modifying/writing data to the server
    // Always returns a result with execute() method for manual execution
    // Write requests are never cached and must be triggered explicitly
    useWriteRequest<TData, TVariables = void>(
        options: UseWriteRequestOptionsInterface<TData, TVariables>,
    ): UseGraphQlMutationRequestResultInterface<TData, TVariables> {
        // Wrap onSuccess to handle cache invalidation
        const onSuccessWithCacheInvalidation = options.invalidateOnSuccess
            ? async (data: TData, variables: TVariables, context: unknown) => {
                  // Get cache keys to invalidate
                  const keysToInvalidate =
                      typeof options.invalidateOnSuccess === 'function'
                          ? options.invalidateOnSuccess(variables)
                          : options.invalidateOnSuccess;

                  // Invalidate each cache key
                  if(keysToInvalidate !== undefined) {
                      for(const key of keysToInvalidate) {
                          await this.invalidateCache(key);
                      }
                  }

                  // Call original onSuccess if provided
                  options.onSuccess?.(data, variables, context);
              }
            : options.onSuccess;

        const mutationResult = tanStackReactQueryUseMutation(
            {
                mutationFn: (variables: TVariables) => this.trackAsyncOperation(() => options.request(variables)),
                onSuccess: onSuccessWithCacheInvalidation,
                onError: options.onError,
                meta: options.metadata,
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

    // Suspense read request method - for use with React Suspense
    // Similar to useReadRequest but throws promises for Suspense boundaries
    useSuspenseReadRequest<TData, TSelected = TData>(
        options: Omit<UseReadRequestOptionsInterface<TData, void, TSelected>, 'enabled'>,
    ): UseSuspenseRequestResultInterface<TSelected> {
        const queryClient = tanStackReactQueryUseQueryClient();

        const queryResult = tanStackReactQueryUseSuspenseQuery(
            {
                queryKey: options.cacheKey,
                queryFn: () => this.trackAsyncOperation(() => options.request()),
                staleTime: options.validDurationInMilliseconds,
                gcTime: options.clearAfterUnusedDurationInMilliseconds,
                refetchInterval: options.refreshIntervalInMilliseconds,
                refetchIntervalInBackground: options.refreshIntervalInBackground,
                refetchOnWindowFocus: options.refreshOnWindowFocus,
                refetchOnReconnect: options.refreshOnReconnect,
                ...(options.maximumRetries !== undefined ? { retry: options.maximumRetries } : {}),
                initialData: options.initialData,
                select: options.select,
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
            ? [variables?: undefined, options?: Partial<UseReadRequestOptionsInterface<TResult, void>>]
            : [variables: TVariables, options?: Partial<UseReadRequestOptionsInterface<TResult, void>>]
    ) {
        // GraphQL queries are read operations that fetch data
        // Use the 'cache: false' option for security-critical queries like auth checks
        return this.useReadRequest<TResult>({
            cacheKey: [query.toString(), variables],
            request: () => this.graphQlRequest(query, variables),
            ...options,
        });
    }

    useGraphQlMutation<TResult, TVariables>(
        mutation: AppOrStructureTypedDocumentString<TResult, TVariables>,
        options?: Partial<UseWriteRequestOptionsInterface<TResult, TVariables>>,
    ) {
        // GraphQL mutations are write operations that modify server data
        // They are never cached and must be executed explicitly via execute()
        return this.useWriteRequest<TResult, TVariables>({
            request: (variables: TVariables) => this.graphQlRequest(mutation, variables),
            ...options,
        });
    }

    // GraphQL suspense query helper
    useSuspenseGraphQlQuery<TResult, TVariables>(
        query: AppOrStructureTypedDocumentString<TResult, TVariables>,
        ...[variables, options]: TVariables extends Record<string, never>
            ? [variables?: undefined, options?: Partial<Omit<UseReadRequestOptionsInterface<TResult, void>, 'enabled'>>]
            : [variables: TVariables, options?: Partial<Omit<UseReadRequestOptionsInterface<TResult, void>, 'enabled'>>]
    ): UseSuspenseRequestResultInterface<TResult> {
        // Suspense queries are always read operations
        // They work with React Suspense boundaries for loading states
        return this.useSuspenseReadRequest<TResult>({
            cacheKey: [query.toString(), variables],
            request: () => this.graphQlRequest(query, variables),
            ...options,
        });
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
        // Clear in-memory cache
        this.tanStackReactQueryClient.clear();

        // Also clear all persisted cache (localStorage and sessionStorage)
        this.clearPersistedCache('All');
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

    // Function to clear persisted cache from storage
    clearPersistedCache(storage: 'LocalStorage' | 'SessionStorage' | 'All' = 'All'): void {
        // Only clear if in browser environment
        if(this.isServerSide()) {
            return;
        }

        // Clear from storage based on the specified type
        if(storage === 'LocalStorage' || storage === 'All') {
            // eslint-disable-next-line structure/local-storage-service-rule
            window.localStorage.removeItem(networkServiceCacheKey);
        }
        else if(storage === 'SessionStorage' || storage === 'All') {
            window.sessionStorage.removeItem(networkServiceCacheKey);
        }
    }

    // Function to get the size of the persisted cache in bytes
    getPersistedCacheSizeInBytes(storage: 'LocalStorage' | 'SessionStorage'): number {
        if(this.isServerSide()) {
            return 0;
        }

        try {
            if(storage === 'LocalStorage') {
                // eslint-disable-next-line structure/local-storage-service-rule
                const data = window.localStorage.getItem(networkServiceCacheKey);
                return data ? new Blob([data]).size : 0;
            }
            else {
                const data = window.sessionStorage.getItem(networkServiceCacheKey);
                return data ? new Blob([data]).size : 0;
            }
        }
        catch(error) {
            console.warn(`[NetworkService] Failed to get ${storage} cache size:`, error);
            return 0;
        }
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
