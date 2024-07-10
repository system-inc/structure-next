'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { useMutation } from '@apollo/client';
import { EmailVerificationVerifyDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - EmailVerificationVerifyForm
export interface EmailVerificationVerifyFormInterface {
    emailAddress: string;
    onSuccess: () => void;
}
export function EmailVerificationVerifyForm(properties: EmailVerificationVerifyFormInterface) {
    // Hooks
    const [emailVerificationVerifyMutation, emailVerificationVerifyMutationState] = useMutation(
        EmailVerificationVerifyDocument,
    );

    // Render the component
    return (
        <div>
            <h1 className="text-xl">Enter the Code We Sent You</h1>
            <p className="mt-2 text-sm text-neutral+3">We sent a 6-digit code to email@domain.com x minutes ago.</p>

            {/* Email Verification Code Form */}
            <Form
                className="mt-8"
                formInputs={[
                    <FormInputText
                        key="emailVerificationCode"
                        className=""
                        id="emailVerificationCode"
                        label="Email Verification Code"
                        description={"Enter the 6-digit code we've sent to your email address."}
                        placeholder="000-000"
                        type="text"
                        required={true}
                    />,
                ]}
                buttonProperties={{
                    variant: 'default',
                    className: 'w-full',
                    children: 'Verify',
                }}
                onSubmit={async function (formValues) {
                    console.log(formValues);

                    // Create a variable to store the result
                    const result: FormSubmitResponseInterface = {
                        success: false,
                    };

                    // Run the mutation
                    const currentEmailVerificationVerifyMutationState = await emailVerificationVerifyMutation({
                        variables: {
                            input: {
                                code: formValues.emailVerificationCode,
                            },
                        },
                    });

                    // Log the mutation state
                    console.log(
                        'currentAccountRegistrationCreateMutationState',
                        currentEmailVerificationVerifyMutationState,
                    );

                    // If there are errors
                    if(currentEmailVerificationVerifyMutationState.errors) {
                        result.message = currentEmailVerificationVerifyMutationState.errors[0]?.message;
                    }
                    // If there is data
                    else {
                        result.success = true;

                        // Run the success callback
                        properties.onSuccess();
                    }

                    return result;
                }}
            />
        </div>
    );
}

// Export - Default
export default EmailVerificationVerifyForm;
