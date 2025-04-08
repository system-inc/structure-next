'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - API
import { SupportTicketAccountAndCommerceOrdersPrivelegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import {
    Envelope,
    // Phone
} from '@phosphor-icons/react';
import { BorderContainer } from '../../BorderContainer';

// Component - CustomerDetails
interface CustomerDetailsInterface {
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged'];
}
export function CustomerDetails(properties: CustomerDetailsInterface) {
    // Properties
    const { account } = properties;

    const userFullName = account ?
        account.defaultProfile.givenName && account.defaultProfile.familyName ? 
            `${account.defaultProfile.givenName} ${account.defaultProfile.familyName}` : '-'
        : undefined;
    
    return (
        <>
            { account ? (
                <div className="flex flex-col gap-4 px-4 pt-3 pb-6 border-b">
                    <div className="flex flex-row items-center justify-start gap-2 my-2">
                        <div className="relative h-8 w-8">
                            <ProfileImage
                                profileImageUrl={account.defaultProfile.images?.[0]?.url}
                                alternateText={account.defaultProfile.displayName || ''}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <div className="text-neutral-500 font-medium">
                            { userFullName }
                            <div className="truncate text-sm">
                                {account.defaultProfile.username && `@${account.defaultProfile.username}`}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-2 text-neutral-500">
                        <div className="relative h-4 w-4">
                            <Envelope />
                        </div>
                        {account.emailAddress}
                    </div>
                    { (account.defaultProfile.preferredName || account.defaultProfile.displayName) && (
                        <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                            <span className="font-regular">
                                {account.defaultProfile.preferredName ? 'Preferred Name' : 'Display Name'}
                            </span>
                            {account.defaultProfile.preferredName || account.defaultProfile.displayName}
                        </div>
                    )}
                    <div className="flex flex-row items-center justify-start gap-2 text-neutral-500">
                        <Badge
                            variant={account.status === 'Active' ? 'success' : 'info'}
                            size="sm"
                        >
                            {account.status}
                        </Badge>
                        {/* <Badge
                            variant="info"
                            size="sm"
                        >
                            Subscriber
                        </Badge> */}
                    </div>
                    {/* <div className="flex flex-row items-center justify-start gap-2 mb-2 text-neutral-500">
                        <div className="relative h-4 w-4">
                            <Phone />
                        </div>
                        123 456 7890
                    </div> */}
                </div>
            ) : (
                <BorderContainer>
                    No account information found
                </BorderContainer>
            )}
        </>
    );
};