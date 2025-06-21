// Types for storage information
export interface LocalStorageStatistics {
    itemCount: number;
    projectSizeBytes: number;
    totalSizeBytes: number;
    estimatedLimitBytes: number;
    percentageUsed: number;
}

// Function to get storage usage statistics
export function getLocalStorageStatistics(prefix: string): LocalStorageStatistics {
    // Return zeros if not in browser environment
    if(typeof window === 'undefined') {
        return {
            projectSizeBytes: 0,
            totalSizeBytes: 0,
            itemCount: 0,
            estimatedLimitBytes: 0,
            percentageUsed: 0,
        };
    }

    let projectSize = 0;
    let totalSize = 0;
    let projectItemCount = 0;

    try {
        // Calculate size of all localStorage items
        for(let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if(key) {
                const value = window.localStorage.getItem(key);
                if(value) {
                    // Calculate size in bytes (JavaScript strings are UTF-16)
                    const itemSize = (key.length + value.length) * 2;
                    totalSize += itemSize;

                    // Track project-specific storage
                    if(key.startsWith(prefix)) {
                        projectSize += itemSize;
                        projectItemCount++;
                    }
                }
            }
        }

        // Estimate storage limit (conservative estimate)
        // Most browsers allow 5-10MB, we'll use 5MB as safe estimate
        const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes

        return {
            projectSizeBytes: projectSize,
            totalSizeBytes: totalSize,
            itemCount: projectItemCount,
            estimatedLimitBytes: estimatedLimit,
            percentageUsed: (totalSize / estimatedLimit) * 100,
        };
    }
    catch(error) {
        console.error('Error calculating storage info:', error);
        return {
            projectSizeBytes: 0,
            totalSizeBytes: 0,
            itemCount: 0,
            estimatedLimitBytes: 5 * 1024 * 1024,
            percentageUsed: 0,
        };
    }
}
