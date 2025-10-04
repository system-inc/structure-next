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
    initialEmailAddress?: string;
    onSuccess: (
        emailAddress: string,
        authenticationSession: AccountAuthenticationQuery['accountAuthentication'],
    ) => void;
}
export function EmailForm(properties: EmailFormProperties) {
    // State
    const [hasAutoSubmitted, setHasAutoSubmitted] = React.useState(false);
    const [isAutoSubmitting] = React.useState(!!properties.initialEmailAddress);

    // Ref to track if we've started the auto-submit (prevents double submit in StrictMode)
    const autoSubmitStartedReference = React.useRef(false);

    // Extract properties for hook dependencies
    const propertiesOnSuccess = properties.onSuccess;

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

    // Function to handle submission
    const handleSubmit = React.useCallback(
        async function (emailAddress: string) {
            try {
                // Run the mutation
                const mutationResult = await accountAuthenticationRegistrationOrSignInCreateRequest.execute({
                    input: {
                        emailAddress: emailAddress,
                    },
                });

                // If there is data
                if(mutationResult?.accountAuthenticationRegistrationOrSignInCreate) {
                    // Run the success callback
                    propertiesOnSuccess(
                        mutationResult.accountAuthenticationRegistrationOrSignInCreate.emailAddress,
                        mutationResult.accountAuthenticationRegistrationOrSignInCreate.authentication,
                    );
                }
            }
            catch(error) {
                console.error('Email form submission error:', error);
            }
        },
        [accountAuthenticationRegistrationOrSignInCreateRequest, propertiesOnSuccess],
    );

    // Effect to auto-submit when initialEmailAddress is provided
    React.useEffect(
        function () {
            if(properties.initialEmailAddress && !hasAutoSubmitted && !autoSubmitStartedReference.current) {
                autoSubmitStartedReference.current = true;
                setHasAutoSubmitted(true);
                handleSubmit(properties.initialEmailAddress);
            }
        },
        [properties.initialEmailAddress, hasAutoSubmitted, handleSubmit],
    );

    // Determine content based on state
    let content;

    // If we're auto-submitting, show loading state
    if(isAutoSubmitting) {
        content = (
            <div className="mt-8 flex items-center justify-center">
                <div className="border-primary-600 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
            </div>
        );
    }
    else {
        content = (
            <>
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
                            defaultValue={properties.initialEmailAddress}
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
                            await handleSubmit(formValues.emailAddress);
                            result.success = true;
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
            </>
        );
    }

    // If auto-submitting, render just the spinner without any container
    if(isAutoSubmitting) {
        return content;
    }

    // Render the component normally
    return (
        <div>
            <h1 className="mb-2 text-xl">{ProjectSettings.title}</h1>
            {content}
        </div>
    );
}
