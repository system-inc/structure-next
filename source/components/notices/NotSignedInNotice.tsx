'use client';

// Dependencies - Main Components
// import { SignInForm } from '@structure/source/modules/account/SignInForm';
import { useUrlPath, useRouter } from '@structure/source/router/Navigation';
import React from 'react';

// Component - NotSignedInNotice
export function NotSignedInNotice() {
    // TODO: Clean this up. Just a quick solution for now.
    const urlPath = useUrlPath() ?? '';
    const router = useRouter();

    // Redirect to sign in with the current path as the redirect path
    React.useEffect(
        function () {
            if(urlPath !== '/sign-in') {
                router.push(`/sign-in?redirectUrl=${encodeURIComponent(urlPath)}`);
            }
        },
        [urlPath, router],
    );

    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="rounded-md border border--0 p-8">{/* <SignInForm className="mb-2 w-80" /> */}</div>
        </div>
    );
}
