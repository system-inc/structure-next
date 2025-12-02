'use client'; // This service uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - API
import { SystemLogClientInput, SystemLogCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { inProductionEnvironment } from '@structure/source/utilities/environment/Environment';

// Class - SystemLogService
class SystemLogService {
    // Send a log entry to the server
    create(input: SystemLogClientInput): void {
        // Only send logs in production
        if(!inProductionEnvironment()) {
            return;
        }

        // Use a direct fetch to avoid any issues with the network service during error states
        // eslint-disable-next-line structure/network-service-rule
        fetch(`https://${ProjectSettings.apis.base.host}${ProjectSettings.apis.base.graphQlPath}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                query: SystemLogCreateDocument.toString(),
                variables: { input },
            }),
        }).catch(function () {
            // Silently fail - don't cause more errors from error logging
        });
    }
}

// Export singleton instance
export const systemLogService = new SystemLogService();
