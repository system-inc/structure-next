// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';

// Component - AccountMenu
export type AccountMenuSignedInProperties = {
    account: Account;
};
export function AccountMenuSignedIn(properties: AccountMenuSignedInProperties) {
    // Email
    const emailAddress = properties.account.emailAddress;

    // Given and family names
    const givenName = properties.account.profile?.givenName;
    const familyName = properties.account.profile?.familyName;

    // Set the display name
    let displayName = properties.account.profile?.displayName;

    // If there is display name
    if(!displayName) {
        // Try using the given and family names
        if(givenName && familyName) {
            displayName = `${givenName} ${familyName}`;
        }
        // Otherwise use the primary email
        else if(emailAddress) {
            displayName = emailAddress;
        }
    }

    // Render the component
    return (
        <div className="w-full">
            {/* Email and role */}
            <div className="border-b border--b px-4 pb-2">
                <Link
                    tabIndex={1}
                    className="font-medium whitespace-nowrap hover:cursor-pointer"
                    href="/account/profile"
                >
                    {displayName}
                </Link>
                {/* If the account is an administrator */}
                {properties.account.isAdministator() && <p className="text-xs content--b">Administrator</p>}
            </div>

            <div className="pt-4">
                <Link
                    className="flex px-4 py-1 whitespace-nowrap hover:cursor-pointer hover:background--b"
                    href="/account/profile"
                >
                    Profile
                </Link>

                {/* If the account is an administrator */}
                {properties.account.isAdministator() && (
                    <Link
                        className="flex px-4 py-1 whitespace-nowrap hover:cursor-pointer hover:background--b"
                        href="/ops"
                    >
                        Ops
                    </Link>
                )}
            </div>
        </div>
    );
}
