'use client';

// Dependencies - Main Components
// import { SignInForm } from '@structure/source/modules/account/SignInForm';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

// Component - NotSignedIn
export function NotSignedIn() {
    // TODO: Clean this up. Just a quick solution for now.
    const pathName = usePathname() ?? '';
    const router = useRouter();

    // Redirect to sign in with the current path as the redirect path
    React.useEffect(
        function () {
            if(pathName !== '/sign-in') {
                router.push(`/sign-in?redirectUrl=${encodeURIComponent(pathName)}`);
            }
        },
        [pathName, router],
    );

    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="rounded-medium border p-8">{/* <SignInForm className="mb-2 w-80" /> */}</div>
        </div>
    );
}

// Export - Default
export default NotSignedIn;
