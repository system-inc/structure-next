'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - API
import { SystemLogClientInput, SystemLogCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - Utilities
import { inProductionEnvironment } from '@structure/source/utilities/environment/Environment';

// Function to send error to logging service
function systemLogCreate(input: SystemLogClientInput) {
    // Only send errors in production
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

// Component - SystemLogProvider
interface SystemLogProviderProperties {
    children: React.ReactNode;
}
export function SystemLogProvider(properties: SystemLogProviderProperties) {
    // Effect to set up global error handlers on mount
    React.useEffect(function () {
        // Global JS errors
        function handleError(event: ErrorEvent) {
            systemLogCreate({
                level: 'Error',
                event: 'ClientError',
                category: 'Unhandled',
                message: event.message,
                stackTrace: event.error?.stack,
                source: event.filename || 'unknown',
                data: {
                    line: event.lineno,
                    column: event.colno,
                    url: window.location.href,
                },
            });
        }

        // Unhandled promise rejections
        function handleRejection(event: PromiseRejectionEvent) {
            systemLogCreate({
                level: 'Error',
                event: 'ClientError',
                category: 'UnhandledRejection',
                message: event.reason?.message || String(event.reason),
                stackTrace: event.reason?.stack,
                source: 'unhandledrejection',
                data: {
                    url: window.location.href,
                },
            });
        }

        // Add the event listeners
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        // On unmount, remove event listeners
        return function () {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    // Render children
    return properties.children;
}
