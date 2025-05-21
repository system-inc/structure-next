'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { ValidationSchema } from '@structure/source/utilities/validation/ValidationSchema';
import { Alert } from '@structure/source/common/notifications/Alert';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { AccountPasswordUpdateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ManagePasswordForm
export interface ManagePasswordFormProperties {
    accountHasPasswordSet: boolean;
    className?: string;
    onComplete?: () => void;
}
export function ManagePasswordForm(properties: ManagePasswordFormProperties) {
    // Hooks
    const [updateMutation] = useMutation(AccountPasswordUpdateDocument);

    // State
    const [success, setSuccess] = React.useState(false);

    // Function to handle form submission
    async function handleSubmit(formValues: { newPassword?: string }): Promise<FormSubmitResponseInterface> {
        const newPassword = formValues.newPassword;

        // If we have a valid maintenance session and no pending challenges, proceed with password update
        try {
            const result = await updateMutation({
                variables: {
                    input: {
                        newPassword: newPassword!,
                    },
                },
            });

            if(result.data?.accountPasswordUpdate.success) {
                setSuccess(true);

                return {
                    success: true,
                };
            }
        }
        catch(error) {
            console.error('An error occurred while updating the password.', error);
        }

        setSuccess(false);

        return {
            success: false,
            message: <Alert variant="error" title="An error occurred while updating your password." />,
        };
    }

    // Render the component
    return (
        <div className={mergeClassNames('', properties.className)}>
            {success && (
                <>
                    <Alert variant="success" title="Your password has been updated." />
                    <Button className="mt-4" onClick={properties.onComplete}>
                        Close
                    </Button>
                </>
            )}

            {!success && (
                <>
                    <h2 className="text-xl font-medium">
                        {properties.accountHasPasswordSet ? 'Change' : 'Set'} Password
                    </h2>
                    <p className="mt-4">
                        {properties.accountHasPasswordSet
                            ? 'Use this form to change your account password.'
                            : 'Improve the security of your account by setting a password.'}
                    </p>

                    <Form
                        className="mt-6"
                        formInputs={[
                            <FormInputText
                                key="newPassword"
                                id="newPassword"
                                className="flex-grow"
                                label="New Password"
                                type="password"
                                validationSchema={new ValidationSchema().required().password()}
                                validateOnChange={true}
                                showValidationSuccessResults={true}
                            />,
                        ]}
                        buttonProperties={{
                            children: properties.accountHasPasswordSet ? 'Change Password' : 'Set Password',
                            processingText: properties.accountHasPasswordSet
                                ? 'Changing password...'
                                : 'Setting password...',
                        }}
                        onSubmit={handleSubmit}
                        resetOnSubmitSuccess={true}
                    />
                </>
            )}
        </div>
    );
}

// Export - Default
export default ManagePasswordForm;
