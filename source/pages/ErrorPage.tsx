'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Alert from '@structure/source/common/notifications/Alert';
import Button from '@structure/source/common/buttons/Button';

// Component - Error
export type ErrorPageProperties = { error: Error & { digest?: string }; reset: () => void };
export function ErrorPage({ error, reset }: ErrorPageProperties) {
    // On mount
    React.useEffect(() => {
        // TODO: Log the error to an error reporting service
        console.error(error);
    }, [error]);

    // Render the component
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Alert variant={'error'} size={'large'} title="Error">
                <div className="space-y-2">
                    {error.message && <p className="break-all">{error.message}</p>}
                    {error.digest && (
                        <p>
                            <i>
                                Identifier: <b>{error.digest}</b>
                            </i>
                        </p>
                    )}
                </div>
                <div className="mt-4">
                    <Button
                        className="w-24"
                        variant={'light'}
                        onClick={async function () {
                            reset();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </Alert>
        </div>
    );
}

// Export - Default
export default ErrorPage;
