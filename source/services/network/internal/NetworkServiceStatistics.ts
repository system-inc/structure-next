// Interface - NetworkRequestStatisticsInterface
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

// Class - NetworkStatistics
export class NetworkStatistics {
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
    private isServerSide: boolean;

    constructor(isServerSide: boolean = false) {
        this.isServerSide = isServerSide;
    }

    // Track the start of a request
    trackRequest(): void {
        if(this.isServerSide) return;

        this.statistics.totalRequests++;
        this.statistics.activeRequests++;
        this.statistics.lastRequestAt = Date.now();
    }

    // Track a successful request
    trackSuccess(responseTimeInMilliseconds: number): void {
        if(this.isServerSide) return;

        this.statistics.successfulRequests++;
        this.statistics.lastSuccessAt = Date.now();
        this.updateResponseTime(responseTimeInMilliseconds);
    }

    // Track a failed request
    trackError(): void {
        if(this.isServerSide) return;

        this.statistics.failedRequests++;
        this.statistics.lastErrorAt = Date.now();
    }

    // Track a cancelled request
    trackCancellation(): void {
        if(this.isServerSide) return;

        this.statistics.cancelledRequests++;
    }

    // Track bytes sent
    trackBytesSent(bytes: number): void {
        if(this.isServerSide) return;

        this.statistics.totalBytesSent += bytes;
    }

    // Track bytes received
    trackBytesReceived(bytes: number): void {
        if(this.isServerSide) return;

        this.statistics.totalBytesReceived += bytes;
    }

    // Track cache hit
    trackCacheHit(): void {
        if(this.isServerSide) return;

        this.statistics.cacheHits++;
    }

    // Track cache miss
    trackCacheMiss(): void {
        if(this.isServerSide) return;

        this.statistics.cacheMisses++;
    }

    // Decrement active requests
    decrementActiveRequests(): void {
        if(this.isServerSide) return;

        this.statistics.activeRequests--;
    }

    // Get a copy of the statistics
    getStatistics(): NetworkRequestStatisticsInterface {
        return { ...this.statistics };
    }

    // Reset all statistics
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

    setServerSide(isServerSide: boolean): void {
        this.isServerSide = isServerSide;
    }

    // Get the size of the persisted cache in bytes
    getPersistedCacheSizeInBytes(storage: 'LocalStorage' | 'SessionStorage', cacheKeyPrefix: string): number {
        if(this.isServerSide || typeof window === 'undefined') {
            return 0;
        }

        try {
            const keyPrefix = cacheKeyPrefix + '-';
            let persistedCacheSizeInBytes = 0;

            // LocalStorage
            if(storage === 'LocalStorage') {
                // eslint-disable-next-line structure/local-storage-service-rule
                for(let i = 0; i < window.localStorage.length; i++) {
                    // eslint-disable-next-line structure/local-storage-service-rule
                    const key = window.localStorage.key(i);
                    if(key && key.startsWith(keyPrefix)) {
                        // eslint-disable-next-line structure/local-storage-service-rule
                        const data = window.localStorage.getItem(key);
                        if(data) {
                            persistedCacheSizeInBytes += new Blob([data]).size;
                        }
                    }
                }
            }
            // SessionStorage
            else if(storage === 'SessionStorage') {
                for(let i = 0; i < window.sessionStorage.length; i++) {
                    const key = window.sessionStorage.key(i);
                    if(key && key.startsWith(keyPrefix)) {
                        const data = window.sessionStorage.getItem(key);
                        if(data) {
                            persistedCacheSizeInBytes += new Blob([data]).size;
                        }
                    }
                }
            }

            return persistedCacheSizeInBytes;
        }
        catch(error) {
            console.warn(`[NetworkServiceStatistics] Failed to get ${storage} cache size:`, error);
            return 0;
        }
    }

    // Private method to update response time statistics
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
}
