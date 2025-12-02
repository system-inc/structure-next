'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Services
import { systemLogService } from '@structure/source/modules/system-log/services/SystemLogService';

// Component - SystemLogProvider
interface SystemLogProviderProperties {
    children: React.ReactNode;
}
export function SystemLogProvider(properties: SystemLogProviderProperties) {
    // Effect to set up global error handlers on mount
    React.useEffect(function () {
        // Global JS errors
        function handleError(event: ErrorEvent) {
            systemLogService.log({
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
            systemLogService.log({
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
