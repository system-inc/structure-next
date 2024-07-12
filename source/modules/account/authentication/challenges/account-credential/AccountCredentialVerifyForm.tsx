'use client'; // This component uses client-only features

// Dependencies - Structure
import { StructureSettings } from '@project/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Form, FormSubmitResponseInterface } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';

// Dependencies - API
import { useMutation } from '@apollo/client';
// import { AccountRegistrationCompleteDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import PhiIcon from '@project/assets/icons/phi/PhiIcon.svg';

// Component - AccountCredentialVerifyForm
export interface AccountCredentialVerifyFormInterface {}
export function AccountCredentialVerifyForm(properties: AccountCredentialVerifyFormInterface) {
    // Hooks
    // const [accountRegistrationCompleteMutation, accountRegistrationCompleteMutationState] = useMutation(
    //     AccountRegistrationCompleteDocument,
    // );

    // Render the component
    return (
        <div>
            <h1 className="text-xl">Finalize Registration</h1>
            <p className="mt-2 text-sm text-neutral+3">You are authenticated and ready to create your account.</p>

            {/* Password Form */}
            <Form
                className="mt-8"
                formInputs={[
                    <FormInputText
                        key="password"
                        className=""
                        id="password"
                        label="Create a Password"
                        type="password"
                        required={true}
                    />,
                ]}
                buttonProperties={{
                    variant: 'default',
                    className: 'w-full',
                    children: 'Create Account',
                }}
                onSubmit={function (formValues) {
                    console.log(formValues);
                    return {
                        success: true,
                    };
                }}
            />

            <p className="mt-6 text-xs text-neutral+3">
                By registering, you agree to our{' '}
                <Link className="text-[#007AFF]" href="/legal/terms-of-service" target="_blank">
                    terms of service
                </Link>{' '}
                and{' '}
                <Link className="text-[#007AFF]" href="/legal/privacy-policy" target="_blank">
                    privacy policy
                </Link>
                .
            </p>
        </div>
    );
}

// Export - Default
export default AccountCredentialVerifyForm;
