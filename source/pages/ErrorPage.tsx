'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Alert } from '@structure/source/components/notifications/Alert';
import { Button } from '@structure/source/components/buttons/Button';

// Component - Error
export type ErrorPageProperties = { error: Error & { digest?: string }; reset: () => void };
export function ErrorPage(properties: ErrorPageProperties) {
    // On mount
    React.useEffect(
        function () {
            // TODO: Log the error to an error reporting service
            console.error(properties.error);
        },
        [properties.error],
    );

    // Render the component
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Alert variant={'error'} size={'large'} title="Error" className="md:min-w-96">
                <div className="space-y-2">
                    {properties.error.message && <p className="break-all">{properties.error.message}</p>}
                    {properties.error.digest && (
                        <p>
                            <i>
                                Identifier: <b>{properties.error.digest}</b>
                            </i>
                        </p>
                    )}
                </div>
                <div className="mt-4">
                    <Button
                        className="w-24"
                        variant="Contrast"
                        onClick={async function () {
                            properties.reset();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </Alert>
        </div>
    );
}
