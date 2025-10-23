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

    const menuLinkClassNames = 'flex items-center px-4 py-1.5 hover:background--2 active:background--3';

    // Render the component
    return (
        <div className="w-full">
            {/* Email and role */}
            <div className="border-b border--0 px-4 pb-2">
                <Link variant="A" className="font-medium" href="/account/profile">
                    {displayName}
                </Link>
                {/* If the account is an administrator */}
                {properties.account.isAdministator() && <p className="mb-1.5 text-xs content--1">Administrator</p>}
            </div>

            <div className="flex flex-col py-3 text-[15px]">
                <Link variant="B" className={menuLinkClassNames} href="/account/profile">
                    Profile
                </Link>

                {/* If the account is an administrator */}
                {properties.account.isAdministator() && (
                    <Link variant="B" className={menuLinkClassNames} href="/ops">
                        Ops
                    </Link>
                )}
            </div>
        </div>
    );
}
