// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AlertInterface, Alert } from '@structure/source/common/notifications/Alert';
import { ApolloError } from '@apollo/client';

// Component - NotAuthorized
export interface ApiErrorInterface {
    error?: ApolloError | Error;
    alertProperties?: AlertInterface;
}
export function ApiError(properties: ApiErrorInterface) {
    console.error(properties.error);

    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Alert variant={'error'} size={'large'} title="API Error" {...properties.alertProperties}>
                <div className="space-y-2">
                    <p>There was an error while communicating with our servers.</p>
                    {properties.error?.message && <p>{properties.error.message}</p>}
                </div>
            </Alert>
        </div>
    );
}

// Export - Default
export default ApiError;
