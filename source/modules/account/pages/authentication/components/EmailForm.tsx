'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

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
    const accountAuthenticationRegistrationOrSignInCreateRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationRegistrationOrSignInCreate($input: AccountRegistrationOrSignInCreateInput!) {
                accountAuthenticationRegistrationOrSignInCreate(input: $input) {
                    emailAddress
                    authentication {
                        status
                        scopeType
                        currentChallenge {
                            challengeType
                            status
                        }
                        updatedAt
                        createdAt
                    }
                }
            }
        `),
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
