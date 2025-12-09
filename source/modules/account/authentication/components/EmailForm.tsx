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

    // Reference to track if we've started the auto-submit (prevents double submit in StrictMode)
    const autoSubmitStartedReference = React.useRef(false);

    // Hooks
    const accountAuthenticationRegistrationOrSignInCreateRequest =
        useAccountAuthenticationRegistrationOrSignInCreateRequest();

    // Extract properties for effect dependencies
    const propertiesInitialEmailAddress = properties.initialEmailAddress;
    const propertiesOnSuccess = properties.onSuccess;

    // Effect to auto-submit when initialEmailAddress is provided
    React.useEffect(
        function () {
            async function autoSubmit() {
                if(propertiesInitialEmailAddress && !hasAutoSubmitted && !autoSubmitStartedReference.current) {
                    autoSubmitStartedReference.current = true;
                    setHasAutoSubmitted(true);

                    try {
                        // Run the mutation
                        const mutationResult = await accountAuthenticationRegistrationOrSignInCreateRequest.execute({
                            input: {
                                emailAddress: propertiesInitialEmailAddress,
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
                        console.error('Email form auto-submit error:', error);
                    }
                }
            }

            autoSubmit();
        },
        [
            propertiesInitialEmailAddress,
            propertiesOnSuccess,
            hasAutoSubmitted,
            accountAuthenticationRegistrationOrSignInCreateRequest,
        ],
    );

    // If we're auto-submitting, show loading state
    if(isAutoSubmitting) {
        return (
            <div className="mt-8 flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border--0 border-t-transparent"></div>
            </div>
        );
    }

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
                        defaultValue={properties.initialEmailAddress}
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
