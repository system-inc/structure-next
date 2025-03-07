// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import GraphQlMutationForm from '@structure/source/api/graphql/GraphQlMutationForm';
import Alert from '@structure/source/common/notifications/Alert';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - API
import { WaitListEntryCreateDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - WaitListForm
export interface WaitListFormInterface {}
export function WaitListForm() {
    // Render the component
    return (
        <GraphQlMutationForm
            mutationDocument={WaitListEntryCreateDocument}
            className="relative w-full max-w-[380px]"
            description={<p className="font-light">Enter your email to register for early access.</p>}
            buttonProperties={{
                className: 'w-full',
                children: 'Register for Early Access',
            }}
            onSubmit={async function (formValues: any, data: any, error: any) {
                // Prepare the message
                let message = null;

                // If there has been an error
                if(error) {
                    if(error.graphQLErrors[0]?.extensions?.validationErrors[0]?.constraints?.isUnique) {
                        message = (
                            <Alert icon={CheckCircledIcon} title={<b>Already Signed Up</b>}>
                                <b>{formValues.emailAddress}</b> is already signed up! Please check your spam folder if
                                you haven&apos;t received the confirmation email yet.
                            </Alert>
                        );
                    }
                    // If there's been another error
                    else {
                        message = (
                            <Alert variant="error" title="Error">
                                There&apos;s been an error: {error.message}.
                            </Alert>
                        );
                    }
                }
                // If there was no error
                else {
                    message = (
                        <Alert icon={CheckCircledIcon} title={<b>Signed Up!</b>}>
                            Thank you for signing up! You will receive a confirmation email at{' '}
                            <b>{formValues.emailAddress}</b> soon.
                        </Alert>
                    );
                }

                return {
                    success: !error,
                    message: message,
                };
            }}
            resetOnSubmitSuccess={true}
        />
    );
}

// Export - Default
export default WaitListForm;
