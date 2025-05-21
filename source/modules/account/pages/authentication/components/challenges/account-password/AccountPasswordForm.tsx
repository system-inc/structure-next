'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { Link } from '@structure/source/common/navigation/Link';
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { useMutation } from '@apollo/client';
import {
    AccountAuthenticationPasswordVerifyDocument,
    AccountAuthenticationQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
// import ArrowRightIcon from '@structure/assets/icons/interface/ArrowRightIcon.svg';

// Component - AccountPasswordForm
export interface AccountPasswordFormProperties {
    emailAddress: string;
    onSuccess: (authenticationSession: AccountAuthenticationQuery['accountAuthentication']) => void;
}
export function AccountPasswordForm(properties: AccountPasswordFormProperties) {
    // Hooks - API - Mutations
    const [accountAuthenticationPasswordVerifyMutation] = useMutation(AccountAuthenticationPasswordVerifyDocument);

    // Render the component
    return (
        <div>
            <div className="text-neutral-33 dark:text-neutral+3">
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

                    // Run the mutation
                    const currentAccountPasswordVerifyMutationState = await accountAuthenticationPasswordVerifyMutation(
                        {
                            variables: {
                                input: {
                                    password: formValues.password,
                                },
                            },
                        },
                    );

                    // Log the mutation state
                    console.log('currentAccountPasswordVerifyMutationState', currentAccountPasswordVerifyMutationState);

                    // If there are errors
                    if(currentAccountPasswordVerifyMutationState.errors) {
                        result.message = currentAccountPasswordVerifyMutationState.errors[0]?.message;
                    }
                    // If there is data
                    else if(currentAccountPasswordVerifyMutationState.data) {
                        result.success = true;

                        // Run the success callback
                        properties.onSuccess(
                            currentAccountPasswordVerifyMutationState.data.accountAuthenticationPasswordVerify
                                .authentication,
                        );
                    }

                    return result;
                }}
            />
        </div>
    );
}

// Export - Default
export default AccountPasswordForm;
