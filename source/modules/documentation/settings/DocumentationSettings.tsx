'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { DocumentationSettingsDialog } from '@structure/source/modules/documentation/settings/dialogs/DocumentationSettingsDialog';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - DocumentationSettings
export interface DocumentationSettingsProperties {
    className?: string;
}
export function DocumentationSettings(properties: DocumentationSettingsProperties) {
    // State
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = React.useState(false);

    // Render the component
    return (
        <div className={mergeClassNames('', properties.className)}>
            <Button
                className="w-full"
                onClick={function () {
                    setIsSettingsDialogOpen(true);
                }}
            >
                Settings
            </Button>

            {/* API Key */}
            <DocumentationSettingsDialog
                isOpen={isSettingsDialogOpen}
                onClose={function () {
                    setIsSettingsDialogOpen(false);
                }}
            />
        </div>
    );
}
