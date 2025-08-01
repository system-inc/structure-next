'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - EmailVerificationVerifyForm
export interface EmailVerificationVerifyFormProperties {
    emailAddress: string;
    onSuccess: (authenticationSession: AccountAuthenticationQuery['accountAuthentication']) => void;
}
export function EmailVerificationVerifyForm(properties: EmailVerificationVerifyFormProperties) {
    // Hooks - API - Mutations
    const accountAuthenticationEmailVerificationVerifyRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationEmailVerificationVerify($input: AccountEmailVerificationVerifyInput!) {
                accountAuthenticationEmailVerificationVerify(input: $input) {
                    verification {
                        status
                        emailAddress
                        lastEmailSentAt
                    }
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

    const accountAuthenticationEmailVerificationSendRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationEmailVerificationSend {
                accountAuthenticationEmailVerificationSend {
                    verification {
                        status
                        emailAddress
                        lastEmailSentAt
                    }
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

    // State
    const [timeEmailSent] = React.useState<number>(Date.now());
    const [timeAgoString, setTimeAgoString] = React.useState<string>('just now');

    // Effect to update the time ago every minute
    React.useEffect(
        function () {
            // Function to update the time ago
            const updateTimeAgo = function () {
                // Calculate the time ago in seconds and minutes
                const timeAgoInSeconds = Math.floor((Date.now() - timeEmailSent) / 1000);
                const timeAgoInMinutes = Math.floor(timeAgoInSeconds / 60);

                let timeAgoString = '';

                // Less than 60 second ago
                if(timeAgoInSeconds < 60) {
                    timeAgoString = 'just now';
                }
                // More than 60 seconds ago
                else {
                    timeAgoString = `${timeAgoInMinutes} minute${timeAgoInMinutes === 1 ? '' : 's'} ago`;
                }

                // Set the time ago
                setTimeAgoString(timeAgoString);
            };

            // Set an interval to update the time ago every second
            const updateTimeAgoInterval = setInterval(updateTimeAgo, 1000);

            // Return the cleanup function
            return function () {
                clearInterval(updateTimeAgoInterval);
            };
        },
        [timeEmailSent],
    );

    // Render the component
    return (
        <div>
            <div className="text-neutral-3 dark:text-neutral+3">
                <p>
                    We sent a code to {properties.emailAddress} {timeAgoString}.
                </p>
            </div>

            {/* Email Verification Code Form */}
            <Form
                className="mt-8"
                formInputs={[
                    <FormInputText
                        key="emailVerificationCode"
                        id="emailVerificationCode"
                        size="large"
                        label="Email Verification Code"
                        labelTip="The email may take a few minutes to arrive. Be sure to check your spam folder if the email is not in
                    your inbox."
                        labelTipIconProperties={{
                            contentClassName: 'w-64 text-sm px-3 py-2.5',
                        }}
                        placeholder="Code"
                        description={'Enter the code sent to ' + properties.emailAddress + '.'}
                        required={true}
                    />,
                ]}
                buttonProperties={{
                    className: 'w-full h-10',
                    children: 'Verify Email',
                }}
                onSubmit={async function (formValues) {
                    console.log(formValues);

                    // Create a variable to store the result
                    const result: FormSubmitResponseInterface = {
                        success: false,
                    };

                    try {
                        // Run the mutation
                        const mutationResult = await accountAuthenticationEmailVerificationVerifyRequest.execute({
                            input: {
                                code: formValues.emailVerificationCode,
                            },
                        });

                        // Log the mutation state
                        console.log('mutationResult', mutationResult);

                        // If there is data
                        if(mutationResult?.accountAuthenticationEmailVerificationVerify) {
                            result.success = true;

                            // Run the success callback
                            properties.onSuccess(
                                mutationResult.accountAuthenticationEmailVerificationVerify.authentication,
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

            {/* Request Another Code */}
            <div className="mt-8 flex justify-center">
                <Button
                    variant="ghost"
                    loading={accountAuthenticationEmailVerificationSendRequest.isLoading}
                    onClick={function () {
                        accountAuthenticationEmailVerificationSendRequest.execute();
                    }}
                >
                    Resend Verification Code
                </Button>
            </div>
        </div>
    );
}
