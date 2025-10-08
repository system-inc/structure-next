// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Constants
const deviceIdLockName = 'device-id-check';
const deviceIdSessionCookieName = 'deviceIdChecked';
const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hour

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

    // Function to check if the session cookie exists and is fresh (within 24 hours)
    private hasDeviceIdSessionCookie(): boolean {
        const cookies = document.cookie.split(';');
        const deviceIdCookie = cookies.find((cookie) => cookie.trim().startsWith(`${deviceIdSessionCookieName}=`));

        if(!deviceIdCookie) {
            return false;
        }

        const cookieValue = deviceIdCookie.split('=')[1];
        if(!cookieValue) {
            return false;
        }

        const timestamp = parseInt(cookieValue, 10);
        const now = Date.now();

        // Check if the timestamp is valid and within the last 24 hours
        return !isNaN(timestamp) && now - timestamp < oneDayInMilliseconds;
    }

    // Function to set the session cookie with current timestamp
    private setDeviceIdSessionCookie(): void {
        const timestamp = Date.now();
        // Session cookie (no expires/max-age = session-only, cleared when browser closes)
        document.cookie = `${deviceIdSessionCookieName}=${timestamp}; path=/; SameSite=Lax`;
    }

    // Function to check if device ID is valid and request a new one if needed
    private async checkAndRequestDeviceId(): Promise<void> {
        // Tab-local check
        if(this.deviceIdChecked) {
            return;
        }

        // Check if Web Locks API is available for cross-tab coordination
        if('locks' in navigator) {
            // Acquire lock (blocking - wait our turn)
            await navigator.locks.request(deviceIdLockName, async () => {
                // Check session cookie: did another tab already do this?
                if(this.hasDeviceIdSessionCookie()) {
                    // Another tab already did it, we're good
                    console.log('Device session already exists.');
                }
                else {
                    // We need to do it
                    await this.performDeviceIdCheck();
                    this.setDeviceIdSessionCookie();
                }
                this.deviceIdChecked = true;
            });
        }
        else {
            // Fallback without Web Locks: check session cookie directly
            if(this.hasDeviceIdSessionCookie()) {
                this.deviceIdChecked = true;
                console.log('Device session already exists.');
            }
            else {
                await this.performDeviceIdCheck();
                this.setDeviceIdSessionCookie();
                this.deviceIdChecked = true;
            }
        }
    }

    // Function to perform the actual device ID check
    private async performDeviceIdCheck(): Promise<void> {
        // Build the deviceId endpoint URL
        const deviceIdUrl = ProjectSettings.apis?.base
            ? `https://${ProjectSettings.apis.base.host}/deviceId`
            : '/deviceId';

        // Fetch deviceId with exponential backoff and retries
        return this.retryWithExponentialBackoff(async () => {
            // Device ID fetch is a special case that needs to use raw fetch
            // to avoid circular dependency (NetworkService -> DeviceId -> NetworkService)
            // eslint-disable-next-line structure/network-service-rule
            const response = await fetch(deviceIdUrl, {
                method: 'GET',
                credentials: 'include',
            });

            if(!response.ok) {
                throw new Error(`Device session failed with status: ${response.status}`);
            }

            // Successfully obtained deviceId
            console.log('Device session started successfully.');
        });
    }

    // Function to stop retrying (useful for cleanup)
    stopRetrying(): void {
        this.deviceIdPromise = null;
        this.deviceIdChecked = false;
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
                `Device session fetch attempt ${nextAttempt} failed${isInSteadyState ? ' (steady state)' : ''}, ` +
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
