'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AlertProperties, Alert } from '@structure/source/components/notifications/Alert';

// Dependencies - Assets
import KeyIcon from '@structure/assets/icons/security/KeyIcon.svg';

// Component - NotAuthorized
export type NotAuthorizedProperties = {
    alertProperties?: AlertProperties;
};
export function NotAuthorized(properties: NotAuthorizedProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Alert
                variant={'error'}
                size={'large'}
                icon={KeyIcon}
                title="Not Authorized"
                {...properties.alertProperties}
            >
                <div className="space-y-2">
                    <p>Your account does not have the required role to access this page.</p>
                    <p>Please contact an administrator if you believe this is an error.</p>
                </div>
            </Alert>
        </div>
    );
}
