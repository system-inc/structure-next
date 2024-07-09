'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputText } from '@structure/source/common/forms/FormInputText';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import PhiIcon from '@project/assets/icons/phi/PhiIcon.svg';

// Component - RegisterPage
export interface RegisterPageInterface {}
export function RegisterPage(properties: RegisterPageInterface) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="min-w-80 p-4">
                <PhiIcon className="mb-8 h-10 w-10" />
                <h1 className="text-xl">Create a Phi Account</h1>
                <p className="mt-2 text-sm text-neutral+3">
                    Already have an account?{' '}
                    <Link className="text-[#007AFF]" href="/sign-in">
                        Sign in.
                    </Link>
                </p>

                <Form
                    className="mt-8"
                    formInputs={[
                        <FormInputText
                            className=""
                            id="emailAddress"
                            label="Email Address"
                            placeholder="email@domain.com"
                            type="email"
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

                <Form
                    className="mt-8"
                    formInputs={[
                        <FormInputText
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
                        children: 'Create Account',
                    }}
                    onSubmit={function (formValues) {
                        console.log(formValues);
                        return {
                            success: true,
                        };
                    }}
                />

                <Form
                    className="mt-8"
                    formInputs={[
                        // <FormInputText className="" id="displayName" label="Name" type="text" required={true} />,
                        // <FormInputText className="" id="username" label="Username" type="text" required={true} />,
                        <FormInputText className="" id="password" label="Password" type="password" required={true} />,
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
                    <Link className="text-[#007AFF]" href="/legal/terms-of-service">
                        terms of service
                    </Link>{' '}
                    and{' '}
                    <Link className="text-[#007AFF]" href="/legal/privacy-policy">
                        privacy policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}

// Export - Default
export default RegisterPage;
