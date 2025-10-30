'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AlertProperties, Alert } from '@structure/source/components/notifications/Alert';
import { GraphQlError } from '@structure/source/api/graphql/utilities/GraphQlUtilities';

// Component - NotAuthorized
export interface ApiErrorProperties {
    error?: GraphQlError | Error;
    alertProperties?: AlertProperties;
}
export function ApiError(properties: ApiErrorProperties) {
    console.error(properties.error);

    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Alert variant={'error'} size={'large'} title="API Error" {...properties.alertProperties}>
                <div className="space-y-2">
                    <p>There was an error while communicating with our servers.</p>
                    {properties.error?.message && (
                        <p>
                            <i>{properties.error.message}</i>
                        </p>
                    )}
                </div>
            </Alert>
        </div>
    );
}
