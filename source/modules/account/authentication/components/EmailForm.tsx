'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { Form, FormSubmitResponseInterface } from '@structure/source/components/forms/Form';
import { FormInputText } from '@structure/source/components/forms/FormInputText';

// Dependencies - API
import { AccountAuthenticationQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { useAccountAuthenticationRegistrationOrSignInCreateRequest } from '@structure/source/modules/account/authentication/hooks/useAccountAuthenticationRegistrationOrSignInCreateRequest';

// Dependencies - Assets
import ArrowRightIcon from '@structure/assets/icons/interface/ArrowRightIcon.svg';

// Component - EmailForm
export interface EmailFormProperties {
    children?: React.ReactNode;
    onSuccess: (
        emailAddress: string,
        authenticationSession: AccountAuthenticationQuery['accountAuthentication'],
    ) => void;
}
export function EmailForm(properties: EmailFormProperties) {
    // Hooks
    const accountAuthenticationRegistrationOrSignInCreateRequest =
        useAccountAuthenticationRegistrationOrSignInCreateRequest();

    // Render the component
    return (
        <div>
            <h1 className="mb-2 text-xl">{ProjectSettings.title}</h1>

            <div className="content--1">
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
                    variant: 'A',
                    className: 'w-full h-10',
                    children: <ArrowRightIcon className="h-4 w-4" />,
                }}
                onSubmit={async function (formValues) {
                    console.log('EmailForm submit', formValues);

                    // Create a variable to store the result
                    const result: FormSubmitResponseInterface = {
                        success: false,
                    };

                    try {
                        // Run the mutation
                        const mutationResult = await accountAuthenticationRegistrationOrSignInCreateRequest.execute({
                            input: {
                                emailAddress: formValues.emailAddress,
                            },
                        });

                        // Log the mutation state
                        console.log('mutationResult', mutationResult);

                        // If there is data
                        if(mutationResult?.accountAuthenticationRegistrationOrSignInCreate) {
                            result.success = true;

                            // Run the success callback
                            properties.onSuccess(
                                mutationResult.accountAuthenticationRegistrationOrSignInCreate.emailAddress,
                                mutationResult.accountAuthenticationRegistrationOrSignInCreate.authentication,
                            );
                        }
                    }
                    catch(error) {
                        // Handle errors
                        result.message = error instanceof Error ? error.message : 'An error occurred';
                    }

                    return result;
                }}
            />

            {/* Disclaimer */}
            <p className="mt-6 text-sm leading-normal content--2">
                By continuing, you agree to the{' '}
                <Link href="/legal/terms-of-service" target="_blank" prefetch={false}>
                    terms of service
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy-policy" target="_blank" prefetch={false}>
                    privacy policy
                </Link>
                .
            </p>
        </div>
    );
}
