'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { useMutation } from '@apollo/client';
import {
    AccountAuthenticationRegistrationOrSignInCreateDocument,
    AccountAuthenticationQuery,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import ArrowRightIcon from '@structure/assets/icons/interface/ArrowRightIcon.svg';

// Component - EmailForm
export interface EmailFormInterface {
    children?: React.ReactNode;
    onSuccess: (
        emailAddress: string,
        authenticationSession: AccountAuthenticationQuery['accountAuthentication'],
    ) => void;
}
export function EmailForm(properties: EmailFormInterface) {
    // Hooks
    const [accountAuthenticationRegistrationOrSignInCreateMutation] = useMutation(
        AccountAuthenticationRegistrationOrSignInCreateDocument,
    );

    // Render the component
    return (
        <div>
            <h1 className="mb-2 text-xl">{ProjectSettings.title}</h1>

            <div className="neutral">
                {properties.children && properties.children}

                <p className="">Enter your email address to sign in or create an account.</p>
            </div>

            <Form
                className="mt-8"
                formInputs={[
                    <FormInputText
                        key="emailAddress"
                        id="emailAddress"
                        size="large"
                        label="Email Address"
                        placeholder="email@domain.com"
                        type="email"
                        required={true}
                    />,
                ]}
                buttonProperties={{
                    className: 'w-full h-10',
                    children: <ArrowRightIcon className="h-4 w-4" />,
                }}
                onSubmit={async function (formValues) {
                    console.log('EmailForm submit', formValues);

                    // Create a variable to store the result
                    const result: FormSubmitResponseInterface = {
                        success: false,
                    };

                    // Run the mutation
                    const currentAccountRegistrationOrSignInCreateMutationState =
                        await accountAuthenticationRegistrationOrSignInCreateMutation({
                            variables: {
                                input: {
                                    emailAddress: formValues.emailAddress,
                                },
                            },
                        });

                    // Log the mutation state
                    console.log(
                        'currentAccountRegistrationOrSignInCreateMutationState',
                        currentAccountRegistrationOrSignInCreateMutationState,
                    );

                    // If there are errors
                    if(currentAccountRegistrationOrSignInCreateMutationState.errors) {
                        result.message = currentAccountRegistrationOrSignInCreateMutationState.errors[0]?.message;
                    }
                    // If there is data
                    else if(currentAccountRegistrationOrSignInCreateMutationState.data) {
                        result.success = true;

                        // Run the success callback
                        properties.onSuccess(
                            currentAccountRegistrationOrSignInCreateMutationState.data
                                .accountAuthenticationRegistrationOrSignInCreate.emailAddress,
                            currentAccountRegistrationOrSignInCreateMutationState.data
                                .accountAuthenticationRegistrationOrSignInCreate.authentication,
                        );
                    }

                    return result;
                }}
            />

            {/* Disclaimer */}
            <p className="mt-6 text-sm leading-normal text-neutral+3">
                By continuing, you agree to the{' '}
                <Link className="primary" href="/legal/terms-of-service" target="_blank" prefetch={false}>
                    terms of service
                </Link>{' '}
                and{' '}
                <Link className="primary" href="/legal/privacy-policy" target="_blank" prefetch={false}>
                    privacy policy
                </Link>
                .
            </p>
        </div>
    );
}

// Export - Default
export default EmailForm;
