// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Authentication } from '@structure/source/modules/account/authentication/Authentication';

// Component - AccountMenu
export type AccountMenuSignedOutProperties = {};
export function AccountMenuSignedOut(properties: AccountMenuSignedOutProperties) {
    // Render the component
    return (
        <div className="relative w-full px-4">
            {/* <Button href="/sign-in" className="w-full">
                Sign In or Create Account
            </Button> */}
            <Authentication scope="SignIn" />
            {/* <SignInForm className="relative mb-6 w-full" /> */}
        </div>
    );
}

// Export - Default
export default AccountMenuSignedOut;
