'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Services
import { systemLogService } from '@structure/source/modules/system-log/services/SystemLogService';

// Component - GlobalErrorPage
// This catches errors in the root layout and server components
// It must include its own <html> and <body> tags since it replaces the entire page
export interface GlobalErrorPageProperties {
    error: Error & { digest?: string };
    reset: () => void;
}
export function GlobalErrorPage(properties: GlobalErrorPageProperties) {
    // Log error on mount
    React.useEffect(
        function () {
            // Log to console for debugging
            console.error(properties.error);

            // Send error to logging service
            systemLogService.log({
                level: 'Critical',
                event: 'ClientError',
                category: 'ServerComponent',
                message: properties.error.message,
                stackTrace: properties.error.stack,
                source: 'GlobalErrorPage',
                data: {
                    digest: properties.error.digest,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                },
            });
        },
        [properties.error],
    );

    // Render the component
    // Note: No providers are available here, so we use inline styles
    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        display: 'flex',
                        height: '100vh',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    <div
                        style={{
                            padding: '24px',
                            borderRadius: '8px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            maxWidth: '400px',
                        }}
                    >
                        <h2 style={{ margin: '0 0 12px 0', color: '#991b1b' }}>Something went wrong</h2>
                        <p style={{ margin: '0 0 16px 0', color: '#7f1d1d' }}>
                            {properties.error.message || 'An unexpected error occurred.'}
                        </p>
                        {properties.error.digest && (
                            <p style={{ margin: '0 0 16px 0', color: '#7f1d1d', fontSize: '14px' }}>
                                <em>
                                    Identifier: <strong>{properties.error.digest}</strong>
                                </em>
                            </p>
                        )}
                        <button
                            onClick={function () {
                                properties.reset();
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
