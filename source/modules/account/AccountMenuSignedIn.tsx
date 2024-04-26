// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';

// Component - AccountMenu
export type AccountMenuSignedInProperties = {
    account: Account;
};
export function AccountMenuSignedIn(properties: AccountMenuSignedInProperties) {
    // Email
    const primaryEmailAddress = properties.account.primaryEmailAddress?.emailAddress;

    // Given and family names
    const givenName = properties.account.currentProfile?.givenName;
    const familyName = properties.account.currentProfile?.familyName;

    // Set the display name
    let displayName = properties.account.currentProfile?.displayName;

    // If there is display name
    if(!displayName) {
        // Try using the given and family names
        if(givenName && familyName) {
            displayName = `${givenName} ${familyName}`;
        }
        // Otherwise use the primary email
        else if(primaryEmailAddress) {
            displayName = primaryEmailAddress;
        }
    }

    // Render the component
    return (
        <div>
            {/* Email and role */}
            <div className="border-b border-b-light-4 px-4 pb-2 dark:border-b-dark-4">
                <Link
                    tabIndex={1}
                    className="whitespace-nowrap font-medium hover:cursor-pointer"
                    href="/account/profile"
                >
                    {displayName}
                </Link>
                {/* If the account is an administrator */}
                {properties.account.isAdministator() && (
                    <p className="text-xs text-dark-4 dark:text-white/50">Administrator</p>
                )}
            </div>

            <div className="pt-4">
                {/* If the account is an administrator */}
                {properties.account.isAdministator() && (
                    <Link
                        className="flex whitespace-nowrap px-4 py-1 hover:cursor-pointer hover:bg-primary/5"
                        href="/internal"
                    >
                        Internal
                    </Link>
                )}
            </div>
        </div>
    );
}

// Export - Default
export default AccountMenuSignedIn;
