'use client'; // Error components must be client components

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Notice } from '@structure/source/components/notices/Notice';
// import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Services
import { systemLogService } from '@structure/source/modules/system-log/services/SystemLogService';

// Component - ErrorPage
// This catches errors in server components (but not the root layout)
// Unlike GlobalErrorPage, this renders within the existing layout and has access to providers
export interface ErrorPageProperties {
    error: Error & { digest?: string };
    reset: () => void;
}
export function ErrorPage(properties: ErrorPageProperties) {
    // Log error on mount
    React.useEffect(
        function () {
            // Log to console for debugging
            console.error(properties.error);

            // Send error to logging service
            systemLogService.log({
                level: 'Error',
                event: 'ClientError',
                category: 'ErrorBoundary',
                message: properties.error.message,
                stackTrace: properties.error.stack,
                source: 'ErrorPage',
                data: {
                    digest: properties.error.digest,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                },
            });
        },
        [properties.error],
    );

    // Render the component
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Notice variant="Negative" title="Error" className="max-w-2xl md:min-w-96">
                <div className="flex flex-col gap-3.5">
                    {properties.error.message && <p className="break-all">{properties.error.message}</p>}
                    {properties.error.digest && (
                        <p>
                            <i>
                                Identifier: <b>{properties.error.digest}</b>
                            </i>
                        </p>
                    )}
                </div>
                {/* <div className="mt-5">
                    <Button
                        variant="Destructive"
                        onClick={function () {
                            properties.reset();
                        }}
                    >
                        Reset
                    </Button>
                </div> */}
            </Notice>
        </div>
    );
}
