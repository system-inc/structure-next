'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AlertProperties, Alert } from '@structure/source/common/notifications/Alert';
import { ApolloError } from '@apollo/client';

// Component - NotAuthorized
export interface ApiErrorProperties {
    error?: ApolloError | Error;
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
