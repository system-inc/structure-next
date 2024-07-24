// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { SignInForm } from '@structure/source/modules/account/SignInForm';

// Component - NotSignedIn
export type NotSignedInProperties = {};
export function NotSignedIn(properties: NotSignedInProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="rounded-md border p-8">
                Sign in form
                {/* <SignInForm className="mb-2 w-80" /> */}
            </div>
        </div>
    );
}

// Export - Default
export default NotSignedIn;
