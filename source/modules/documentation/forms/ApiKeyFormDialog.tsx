'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { Dialog } from '@structure/source/common/dialogs/Dialog';

// Dependencies - Shared State
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useAtom } from 'jotai';

// Atom for API key
export const apiKeyAtom = atomWithStorage<string>(
    'apiKey', // Key
    '', // Default value
    // Use local storage to persist the state
    typeof localStorage !== 'undefined'
        ? createJSONStorage(function () {
              return localStorage;
          })
        : undefined,
    {
        getOnInit: true, // Get the value on initialization (this is important for SSR)
    },
);

// Component - ApiKeyFormDialog
export interface ApiKeyFormDialogInterface {
    isOpen: boolean;
    onClose: () => void;
}
export function ApiKeyFormDialog(properties: ApiKeyFormDialogInterface) {
    // State
    const [apiKey, setApiKey] = useAtom(apiKeyAtom);
    const [newApiKey, setNewApiKey] = React.useState(apiKey);

    // Effect to sync form with current apiKey when dialog opens
    React.useEffect(
        function () {
            if(properties.isOpen) {
                setNewApiKey(apiKey);
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
