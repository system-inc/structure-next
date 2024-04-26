// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import SignInForm from './SignInForm';

// Component - AccountMenu
export type AccountMenuSignedOutProperties = {};
export function AccountMenuSignedOut(properties: AccountMenuSignedOutProperties) {
    // Render the component
    return (
        <div className="relative w-full px-4">
            <SignInForm className="relative mb-6 w-full" />
        </div>
    );
}

// Export - Default
export default AccountMenuSignedOut;
