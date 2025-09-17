'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { Alert } from '@structure/source/common/notifications/Alert';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - DeleteAccountForm
export interface DeleteAccountFormProperties {
    className?: string;
    onComplete?: () => void;
}
export function DeleteAccountForm(properties: DeleteAccountFormProperties) {
    // State
    const [success, setSuccess] = React.useState(false);

    // Hooks
    const accountDeleteRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountDelete($reason: String) {
                accountDelete(reason: $reason) {
                    success
                }
            }
        `),
    );

    // Function to handle form submission
    async function handleSubmit(formValues: { reason?: string }): Promise<FormSubmitResponseInterface> {
        const reason = formValues.reason;

        // If we have a valid maintenance session and no pending challenges, proceed with password update
        try {
            const result = await accountDeleteRequest.execute({
                reason: reason,
            });

            if(result.accountDelete.success) {
                setSuccess(true);

                return {
                    success: true,
                };
            }
        }
        catch(error) {
            console.error('An error occurred while deleting your account.', error);
        }

        setSuccess(false);

        return {
            success: false,
            message: <Alert variant="error" title="An error occurred while deleting your account." />,
        };
    }

    // Render the component
    return (
        <div className={mergeClassNames('', properties.className)}>
            {success && (
                <>
                    <Alert variant="success" title="Your account has been deleted." />
                    <Button className="mt-4" onClick={properties.onComplete}>
                        Close
                    </Button>
                </>
            )}

            {!success && (
                <>
                    <Form
                        className="mt-6"
                        formInputs={[
                            <FormInputText key="reason" id="reason" className="flex-grow" label="Reason (optional)" />,
                        ]}
                        buttonProperties={{
                            children: 'Delete Account',
                            processingText: 'Deleting account...',
                        }}
                        onSubmit={handleSubmit}
                        resetOnSubmitSuccess={true}
                    />
                </>
            )}
        </div>
    );
}
