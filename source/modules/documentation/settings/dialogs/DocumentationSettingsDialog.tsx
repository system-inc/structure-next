'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { Dialog } from '@structure/source/common/dialogs/Dialog';

// Dependencies - Services
import { useLocalStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - Utilities
import { uppercaseFirstCharacter } from '@structure/source/utilities/String';

// Component - DocumentationSettingsDialog
export interface DocumentationSettingsDialogProperties {
    documentationIdentifier: string;
    isOpen: boolean;
    onClose: () => void;
}
export function DocumentationSettingsDialog(properties: DocumentationSettingsDialogProperties) {
    // Use localStorage service for API key with unique identifier
    const { value: apiKey, set: setApiKey } = useLocalStorageService<string | null>(
        uppercaseFirstCharacter(properties.documentationIdentifier) + 'DocumentationApiKey',
    );

    // State for the form input
    const [newApiKey, setNewApiKey] = React.useState(apiKey || '');

    // Effect to sync form with current apiKey when dialog opens
    React.useEffect(
        function () {
            if(properties.isOpen) {
                setNewApiKey(apiKey || '');
            }
        },
        [properties.isOpen, apiKey],
    );

    // Function to handle form submission
    async function handleSubmit() {
        setApiKey(newApiKey);
        properties.onClose();
        return { success: true };
    }

    // Render the component
    return (
        <Dialog
            open={properties.isOpen}
            onOpenChange={properties.onClose}
            header="Set API Key"
            content={
                <Form
                    formInputs={[
                        <FormInputText
                            key="apiKey"
                            id="apiKey"
                            label="API Key"
                            defaultValue={newApiKey}
                            onChange={function (value) {
                                setNewApiKey(value || '');
                            }}
                        />,
                    ]}
                    buttonProperties={{
                        children: 'Save API Key',
                        disabled: !newApiKey || newApiKey === apiKey,
                    }}
                    onSubmit={handleSubmit}
                />
            }
        />
    );
}
