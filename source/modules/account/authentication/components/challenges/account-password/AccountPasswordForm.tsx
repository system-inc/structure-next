'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { Link } from '@structure/source/components/navigation/Link';
import { Form, FormSubmitResponseInterface } from '@structure/source/components/forms/Form';
import { FormInputText } from '@structure/source/components/forms/FormInputText';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
// import ArrowRightIcon from '@structure/assets/icons/interface/ArrowRightIcon.svg';

// Component - AccountPasswordForm
export interface AccountPasswordFormProperties {
    emailAddress: string;
    onSuccess: (authenticationSession: AccountAuthenticationQuery['accountAuthentication']) => void;
}
export function AccountPasswordForm(properties: AccountPasswordFormProperties) {
    // Hooks - API - Mutations
    const accountAuthenticationPasswordVerifyRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationPasswordVerify($input: AccountPasswordVerifyInput!) {
                accountAuthenticationPasswordVerify(input: $input) {
                    success
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
            <div className="content--2">
                <p>
                    Enter the password for {properties.emailAddress}.{' '}
                    {/* <Link className="primary" href="/account/authentication/forgot-password">
                        Forgot your password?
                    </Link> */}
                </p>
            </div>

            <Form
                className="mt-8"
                formInputs={[
                    <FormInputText
                        key="password"
                        id="password"
                        size="large"
                        label="Password"
                        placeholder="Password"
                        required={true}
                        type="password"
                    />,
                ]}
                buttonProperties={{
                    className: 'w-full h-10',
                    children: 'Submit',
                }}
                onSubmit={async function (formValues) {
                    // console.log(formValues);

                    // Create a variable to store the result
                    const result: FormSubmitResponseInterface = {
                        success: false,
                    };

                    try {
                        // Run the mutation
                        const mutationResult = await accountAuthenticationPasswordVerifyRequest.execute({
                            input: {
                                password: formValues.password,
                            },
                        });

                        // Log the mutation state
                        console.log('mutationResult', mutationResult);

                        // If there is data
                        if(mutationResult?.accountAuthenticationPasswordVerify) {
                            result.success = true;

                            // Run the success callback
                            properties.onSuccess(mutationResult.accountAuthenticationPasswordVerify.authentication);
                        }
                    }
                    catch(error) {
                        // Handle errors
                        result.message = error instanceof Error ? error.message : 'An error occurred';
                    }

                    return result;
                }}
            />
        </div>
    );
}
