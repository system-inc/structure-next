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
