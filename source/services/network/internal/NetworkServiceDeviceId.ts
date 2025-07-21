// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Constants
const deviceIdUpdatedAtLocalStorageKey = 'DeviceIdUpdatedAt';
const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000;

// Retry configuration - Gmail-style infinite retry with backoff
const deviceIdRequestRetryConfiguration = {
    // Initial retry delays: 1s, 2s, 4s, 8s, 16s, 32s, then 60s forever
    initialRetryDelayInMilliseconds: 1000,
    backoffMultiplier: 2,
    maximumDelayInMilliseconds: 60000, // 1 minute max delay
    steadyStateDelayInMilliseconds: 60000, // Retry every minute after backoff
    jitterFactor: 0.1, // 10% jitter to avoid thundering herd
    // Number of exponential backoff attempts before switching to steady state
    exponentialBackoffAttempts: 6,
};

// NetworkServiceDeviceId class
export class NetworkServiceDeviceId {
    private deviceIdPromise: Promise<void> | null = null;
    private deviceIdChecked = false;
    private readonly isServerSide: boolean;

    constructor(isServerSide: boolean) {
        this.isServerSide = isServerSide;
    }

    /**
     * Ensures device ID is valid before making requests.
     * All requests will queue until device ID is obtained.
     */
    async ensure(): Promise<void> {
        // Skip deviceId check if accounts module is disabled or on server side
        if(!ProjectSettings.modules?.accounts || this.isServerSide) {
            return;
        }

        // If already checking, return the same promise so requests queue
        if(this.deviceIdPromise) {
            return this.deviceIdPromise;
        }

        // If already checked this session, skip
        if(this.deviceIdChecked) {
            return;
        }

        // Start the check
        this.deviceIdPromise = this.checkAndRequestDeviceId();

        try {
            await this.deviceIdPromise;
            this.deviceIdChecked = true;
        } finally {
            this.deviceIdPromise = null;
        }
    }

    // Function to reset device ID state, forcing a re-check on next request
    reset(): void {
        this.deviceIdChecked = false;
        this.deviceIdPromise = null;
    }

    // Function to get the last updated timestamp from localStorage
    private getLastUpdated(): number | null {
        return localStorageService.get<number>(deviceIdUpdatedAtLocalStorageKey);
    }

    // Function to set the last updated timestamp in localStorage
    private setLastUpdated(timestamp: number): void {
        localStorageService.set<number>(deviceIdUpdatedAtLocalStorageKey, timestamp);
    }

    // Function to check if device ID is valid and request a new one if needed
    private async checkAndRequestDeviceId(): Promise<void> {
        const lastUpdated = this.getLastUpdated();
        const sixMonthsAgo = Date.now() - sixMonthsInMilliseconds;

        if(lastUpdated && lastUpdated > sixMonthsAgo) {
            // Valid deviceId exists
            return;
        }

        // Build the deviceId endpoint URL
        const deviceIdUrl = ProjectSettings.apis?.base
            ? `https://${ProjectSettings.apis.base.host}/graphql/deviceId`
            : '/graphql/deviceId';

        // Fetch deviceId with exponential backoff and retries
        return this.retryWithExponentialBackoff(async () => {
            // Device ID fetch is a special case that needs to use raw fetch
            // to avoid circular dependency (NetworkService -> DeviceId -> NetworkService)
            // eslint-disable-next-line structure/network-service-rule
            const response = await fetch(deviceIdUrl, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: '{ deviceId }' }),
            });

            if(!response.ok) {
                throw new Error(`DeviceId fetch failed with status: ${response.status}`);
            }

            this.setLastUpdated(Date.now());
        });
    }

    // Function to stop retrying (useful for cleanup)
    stopRetrying(): void {
        this.deviceIdPromise = null;
        this.deviceIdChecked = false;
    }

    // Function to get the status of the device ID
    getStatus(): {
        isValid: boolean;
        lastUpdated: Date | null;
        expiresAt: Date | null;
        daysUntilExpiration: number | null;
    } {
        const lastUpdated = this.getLastUpdated();

        if(!lastUpdated) {
            return {
                isValid: false,
                lastUpdated: null,
                expiresAt: null,
                daysUntilExpiration: null,
            };
        }

        const lastUpdatedDate = new Date(lastUpdated);
        const expiresAt = new Date(lastUpdated + sixMonthsInMilliseconds);
        const now = Date.now();
        const daysUntilExpiration = Math.floor((expiresAt.getTime() - now) / (1000 * 60 * 60 * 24));

        return {
            isValid: now < expiresAt.getTime(),
            lastUpdated: lastUpdatedDate,
            expiresAt,
            daysUntilExpiration: daysUntilExpiration > 0 ? daysUntilExpiration : 0,
        };
    }

    // Function to retry a function with exponential backoff
    private async retryWithExponentialBackoff<T>(
        functionToRetry: () => Promise<T>,
        attemptNumber: number = 0,
    ): Promise<T> {
        try {
            return await functionToRetry();
        }
        catch(error) {
            const nextAttempt = attemptNumber + 1;

            // Never give up, keep retrying forever
            // This ensures the app continues to work even after network outages

            // Calculate delay: exponential backoff for first N attempts, then steady state
            let baseDelay: number;
            if(attemptNumber < deviceIdRequestRetryConfiguration.exponentialBackoffAttempts) {
                // Exponential backoff phase
                baseDelay = Math.min(
                    deviceIdRequestRetryConfiguration.initialRetryDelayInMilliseconds *
                        Math.pow(deviceIdRequestRetryConfiguration.backoffMultiplier, attemptNumber),
                    deviceIdRequestRetryConfiguration.maximumDelayInMilliseconds,
                );
            }
            else {
                // Steady state: retry every minute
                baseDelay = deviceIdRequestRetryConfiguration.steadyStateDelayInMilliseconds;
            }

            // Add jitter to prevent thundering herd
            const jitter = baseDelay * deviceIdRequestRetryConfiguration.jitterFactor * (Math.random() * 2 - 1);
            const delay = Math.max(0, baseDelay + jitter);

            // Log retry attempt for debugging
            const isInSteadyState = attemptNumber >= deviceIdRequestRetryConfiguration.exponentialBackoffAttempts;
            console.warn(
                `DeviceId fetch attempt ${nextAttempt} failed${isInSteadyState ? ' (steady state)' : ''}, ` +
                    `retrying in ${Math.round(delay)}ms:`,
                error instanceof Error ? error.message : error,
            );

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));

            // Retry recursively
            return this.retryWithExponentialBackoff(functionToRetry, nextAttempt);
        }
    }
}
