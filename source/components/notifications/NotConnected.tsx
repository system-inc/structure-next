// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AlertProperties, Alert } from '@structure/source/components/notifications/Alert';

// Dependencies - Assets
import CloudErrorIcon from '@structure/assets/icons/status/CloudErrorIcon.svg';

// Component - NotSignedIn
export type NotConnectedProperties = {
    alertProperties?: AlertProperties;
};
export function NotConnected(properties: NotConnectedProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Alert
                variant="Negative"
                size="Large"
                icon={CloudErrorIcon}
                title="Not Connected"
                {...properties.alertProperties}
            >
                <div className="space-y-2">
                    <p>Unable to connect to the {ProjectSettings.title} servers.</p>
                </div>
            </Alert>
        </div>
    );
}
