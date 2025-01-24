// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Account
import { Account } from '@structure/source/modules/account/Account';
import { PopoverItem, PopoverSeparator } from '@project/source/ui/Popover';
import { CrownSimple, User, Wrench } from '@phosphor-icons/react';
import ProfileImage from './ProfileImage';

// Component - AccountMenu
export type AccountMenuSignedInProperties = {
    account: Account;
    profileImage: {
        url?: string;
        alt?: string;
    };
};
export function AccountMenuSignedIn({ account, profileImage }: AccountMenuSignedInProperties) {
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
                <div className="flex items-center justify-between hover:cursor-auto hover:bg-opsis-background-tetriary active:bg-opsis-background-tetriary">
                    <div className="flex items-center justify-start gap-3">
                        <div className="aspect-square w-10">
                            <ProfileImage profileImageUrl={profileImage.url} alternateText={profileImage.alt} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-opsis-content-primary">{displayName}</p>
                            <p className="text-xs font-normal text-opsis-content-secondary">
                                @{account.profile.username}
                            </p>
                        </div>
                    </div>

                    {/* Icon */}
                    {account.isAdministator() && <CrownSimple className="h-4 w-4 text-opsis-content-secondary" />}
                </div>
            </PopoverItem>

            <PopoverSeparator />

            {/* Links */}
            {links.map(function (link, index) {
                return (
                    <PopoverItem key={index} className="block" asChild>
                        <Link href={link.href}>
                            <link.icon className="mr-3" />
                            <span>{link.text}</span>
                        </Link>
                    </PopoverItem>
                );
            })}
        </React.Fragment>
    );
}

// Export - Default
export default AccountMenuSignedIn;
