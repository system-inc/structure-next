'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Badge } from '@structure/source/common/notifications/Badge';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - API
import { SupportTicketAccountAndCommerceOrdersPrivelegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import {
    Envelope,
    // Phone
} from '@phosphor-icons/react';
import { BorderContainer } from '../BorderContainer';

// Component - CustomerDetails
interface CustomerDetailsProperties {
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged'];
}
export function CustomerDetails(properties: CustomerDetailsProperties) {
    const userFullName = properties.account
        ? properties.account.defaultProfile.givenName && properties.account.defaultProfile.familyName
            ? `${properties.account.defaultProfile.givenName} ${properties.account.defaultProfile.familyName}`
            : '-'
        : undefined;

    return (
        <>
            {properties.account ? (
                <div className="flex flex-col gap-4 border-b px-4 pb-6 pt-3">
                    <div className="my-2 flex flex-row items-center justify-start gap-2">
                        <div className="relative h-8 w-8">
                            <ProfileImage
                                profileImageUrl={properties.account.defaultProfile.images?.[0]?.url}
                                alternateText={properties.account.defaultProfile.displayName || ''}
                                className="h-full w-full rounded-full object-cover"
                            />
                        </div>
                        <div className="text-neutral-500 font-medium">
                            {userFullName}
                            <div className="truncate text-sm">
                                {properties.account.defaultProfile.username &&
                                    `@${properties.account.defaultProfile.username}`}
                            </div>
                        </div>
                    </div>
                    <div className="text-neutral-500 flex flex-row items-center justify-start gap-2">
                        <div className="relative h-4 w-4">
                            <Envelope />
                        </div>
                        {properties.account.emailAddress}
                    </div>
                    {(properties.account.defaultProfile.preferredName ||
                        properties.account.defaultProfile.displayName) && (
                        <div className="text-neutral-500 flex flex-row items-center justify-start gap-4">
                            <span className="font-regular">
                                {properties.account.defaultProfile.preferredName ? 'Preferred Name' : 'Display Name'}
                            </span>
                            {properties.account.defaultProfile.preferredName ||
                                properties.account.defaultProfile.displayName}
                        </div>
                    )}
                    <div className="text-neutral-500 flex flex-row items-center justify-start gap-2">
                        <Badge variant={properties.account.status === 'Active' ? 'success' : 'info'} size="large">
                            {properties.account.status}
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
                <BorderContainer>No account information found</BorderContainer>
            )}
        </>
    );
}
