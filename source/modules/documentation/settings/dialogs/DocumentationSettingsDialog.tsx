'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form } from '@structure/source/components/forms/Form';
import { FormInputText } from '@structure/source/components/forms/FormInputText';
import { Dialog } from '@structure/source/components/dialogs/Dialog';

// Dependencies - Services
import { useLocalStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - Utilities
import { uppercaseFirstCharacter } from '@structure/source/utilities/type/String';

// Component - DocumentationSettingsDialog
export interface DocumentationSettingsDialogProperties {
    documentationIdentifier: string;
    isOpen: boolean;
    onClose: () => void;
}
export function DocumentationSettingsDialog(properties: DocumentationSettingsDialogProperties) {
    // Use localStorage service for API key with unique identifier
    const localStorageService = useLocalStorageService<string | null>(
        uppercaseFirstCharacter(properties.documentationIdentifier) + 'DocumentationApiKey',
    );

    // State for the form input
    const [newApiKey, setNewApiKey] = React.useState(localStorageService.value || '');

    // Effect to sync form with current apiKey when dialog opens
    React.useEffect(
        function () {
            if(properties.isOpen) {
                setNewApiKey(localStorageService.value || '');
            }
        },
        [properties.isOpen, localStorageService.value],
    );

    // Function to handle form submission
    async function handleSubmit() {
        localStorageService.set(newApiKey);
        properties.onClose();
        return { success: true };
    }

    // Render the component
    return (
        <Dialog
            variant="A"
            accessibilityTitle="Set API Key"
            accessibilityDescription="Configure API key for documentation access"
            open={properties.isOpen}
            onOpenChange={properties.onClose}
        >
            <Dialog.Header>Set API Key</Dialog.Header>
            <Dialog.Body>
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
                        disabled: !newApiKey || newApiKey === localStorageService.value,
                    }}
                    onSubmit={handleSubmit}
                />
            </Dialog.Body>
        </Dialog>
    );
}
