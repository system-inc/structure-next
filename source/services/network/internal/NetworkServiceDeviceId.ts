// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Constants
const deviceIdRequestedLocalStorageKey = 'DeviceIdRequested';

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

    // Function to ensure a device ID is valid before making requests
    async ensure(refresh: boolean = false): Promise<void> {
        // Skip deviceId check if server side
        if(this.isServerSide) {
            return;
        }

        // If already checking, return the same promise so requests queue
        if(this.deviceIdPromise) {
            return this.deviceIdPromise;
        }

        // If already checked this session and not refreshing, skip
        if(this.deviceIdChecked && !refresh) {
            return;
        }

        // Start the check
        this.deviceIdPromise = this.checkAndRequestDeviceId(refresh);

        try {
            await this.deviceIdPromise;
            this.deviceIdChecked = true;
        } finally {
            this.deviceIdPromise = null;
        }
    }

    // Function to check if device ID has been requested
    private hasRequestedDeviceId(): boolean {
        return localStorageService.get<boolean>(deviceIdRequestedLocalStorageKey) === true;
    }

    // Function to mark that device ID has been requested
    private markDeviceIdRequestedInLocalStorage(): void {
        localStorageService.set<boolean>(deviceIdRequestedLocalStorageKey, true);
    }

    // Function to check if device ID has been requested and request one if needed
    private async checkAndRequestDeviceId(refresh: boolean = false): Promise<void> {
        // Skip check if already requested (unless skipping cache)
        if(!refresh && this.hasRequestedDeviceId()) {
            return;
        }

        // Build the deviceId endpoint URL
        const deviceIdUrl = ProjectSettings.apis?.base
            ? `https://${ProjectSettings.apis.base.host}/deviceId`
            : '/deviceId';

        // Fetch deviceId with exponential backoff and retries
        return this.retryWithExponentialBackoff(async () => {
            // Use navigator.locks if available to prevent concurrent fetches from many tabs
            // This will serialize deviceId requests across tabs
            const response = await (typeof navigator !== 'undefined' && navigator.locks
                ? navigator.locks.request(deviceIdUrl, function () {
                      // console.log('[NetworkServiceDeviceId] Acquired lock for deviceId fetch:', deviceIdUrl);

                      // Device ID fetch is a special case that needs to use raw fetch
                      // to avoid circular dependency (NetworkService -> DeviceId -> NetworkService)
                      // eslint-disable-next-line structure/network-service-rule
                      return fetch(deviceIdUrl, {
                          method: 'GET',
                          credentials: 'include',
                      });
                  })
                : // eslint-disable-next-line structure/network-service-rule
                  fetch(deviceIdUrl, {
                      method: 'GET',
                      credentials: 'include',
                  }));

            // If the request succeeded
            if(response.ok) {
                // Mark device ID as requested in local storage
                this.markDeviceIdRequestedInLocalStorage();
            }
            // If the request to get a deviceId failed
            else {
                throw new Error(`DeviceId fetch failed with status: ${response.status}`);
            }
        });
    }

    // Function to stop retrying (useful for cleanup)
    stopRetrying(): void {
        this.deviceIdPromise = null;
        this.deviceIdChecked = false;
    }

    // Function to get the status of the device ID
    getStatus(): {
        hasBeenRequested: boolean;
    } {
        return {
            hasBeenRequested: this.hasRequestedDeviceId(),
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
