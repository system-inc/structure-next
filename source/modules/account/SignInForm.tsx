// 'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import GraphQlMutationForm from '@structure/source/api/GraphQlMutationForm';
import Alert from '@structure/source/common/notifications/Alert';

// Dependencies - Accounts
import { useSession } from '@structure/source/modules/account/SessionProvider';

// Dependencies - API
import { AccountSignInDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - WaitListForm
export interface SignInFormInterface {
    className?: string;
}
export function SignInForm(properties: SignInFormInterface) {
    // Use the session hook
    const { setSessionToken } = useSession();

    // Render the component
    return (
        <GraphQlMutationForm
            mutationDocument={AccountSignInDocument}
            className={mergeClassNames('', properties.className)}
            description={<p className="font-medium">Sign In</p>}
            buttonProperties={{
                tabIndex: 1,
                className: 'w-full',
                children: 'Sign In',
                processingText: 'Signing In...',
            }}
            onSubmit={async function (formValues: any, data: any, error: any) {
                // Prepare the message
                let message = null;

                // If there has been an error
                if(error) {
                    message = <Alert variant={'error'} title="Invalid email address or password." />;
                }
                // If there was no error
                else {
                    if(data.accountSignIn?.currentSession?.token) {
                        // console.log('Session token:', data.accountSignIn?.currentSession?.token);
                        setSessionToken(data.accountSignIn?.currentSession?.token);
                    }

                    // message = <Alert variant={'success'} title="Signed in!" />;
                }

                return {
                    success: !error,
                    message: message,
                };
            }}
        />
    );
}

// Export - Default
export default SignInForm;
