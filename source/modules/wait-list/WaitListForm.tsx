// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { GraphQlOperationForm } from '@structure/source/api/graphql/forms/GraphQlOperationForm';
import { Alert } from '@structure/source/common/notifications/Alert';

// Dependencies - Assets
import CheckCircledIcon from '@structure/assets/icons/status/CheckCircledIcon.svg';

// Dependencies - API
import { WaitListEntryCreateOperation } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - API
import { isUniqueConstraintError } from '@structure/source/api/graphql/GraphQlUtilities';

// Component - WaitListForm
export function WaitListForm() {
    // Message state to display custom message
    const [formMessage, setFormMessage] = React.useState<React.ReactNode | null>(null);

    // Render the component
    return (
        <>
            {formMessage && <div className="mb-4">{formMessage}</div>}
            <GraphQlOperationForm
                operation={WaitListEntryCreateOperation}
                className="relative w-full max-w-[380px]"
                description={<p className="font-light">Enter your email to register for early access.</p>}
                buttonProperties={{
                    className: 'w-full',
                    children: 'Register for Early Access',
                }}
                onSubmit={async function (formValues, mutationResponseData, mutationResponseError) {
                    // Prepare the message
                    let message = null;

                    // If there has been an error
                    if(mutationResponseError) {
                        // If the error is a unique constraint error, the email is already signed up
                        if(isUniqueConstraintError(mutationResponseError)) {
                            message = (
                                <Alert icon={CheckCircledIcon} title={<b>Already Signed Up</b>}>
                                    <b>{formValues.emailAddress}</b> is already signed up! Please check your spam folder
                                    if you haven&apos;t received the confirmation email yet.
                                </Alert>
                            );
                        }
                        // If there's been another error
                        else {
                            message = (
                                <Alert variant="error" title="Error">
                                    There&apos;s been an error: {mutationResponseError.message}.
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

                    // Set the message in state to display it
                    setFormMessage(message);
                }}
                resetOnSubmitSuccess={true}
            />
        </>
    );
}
