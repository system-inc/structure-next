// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';
import { PopoverItem, PopoverLink, PopoverSeparator } from '@project/source/ui/base/Popover';
import { User, Wrench } from '@phosphor-icons/react';
import AccountBannerButton from './AccountBannerButton';

// Component - AccountMenu
export type AccountMenuSignedInProperties = {
    account: Account;
    profileImage: {
        url?: string;
        alt?: string;
    };
    closePopover: () => void;
};
export function AccountMenuSignedIn({ account, closePopover }: AccountMenuSignedInProperties) {
    // Email
    const emailAddress = account.emailAddress;

    // Given and family names
    const givenName = account.profile?.givenName;
    const familyName = account.profile?.familyName;

    // Set the display name
    let displayName = account.profile?.displayName;

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

    const links = [
        // Defaults
        [
            {
                href: '/account/profile',
                text: 'Profile',
                icon: User,
            },
        ],
        // If signed in
        account.isAdministator()
            ? [
                  {
                      href: '/internal',
                      text: 'Internal',
                      icon: Wrench,
                  },
              ]
            : [],
    ]
        // Flatten the arrays
        .flat();

    // Render the component
    return (
        <React.Fragment>
            {/* Email and role */}
            <PopoverItem asChild>
                <AccountBannerButton />
            </PopoverItem>

            <PopoverSeparator />

            {/* Links */}
            {links.map(function (link, index) {
                return (
                    <PopoverLink key={index} href={link.href} onClick={closePopover}>
                        <link.icon className="mr-3" />
                        <span>{link.text}</span>
                    </PopoverLink>
                );
            })}
        </React.Fragment>
    );
}

// Export - Default
export default AccountMenuSignedIn;
