'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - Assets
import { Envelope, Phone } from '@phosphor-icons/react';

// Component - CustomerDetails
export function CustomerDetails() {
    return (
        <div className="flex flex-col gap-4 px-4 pt-3 pb-6 border-b">
            <div className="flex flex-row items-center justify-start gap-2 my-2">
                <div className="relative h-8 w-8">
                    <ProfileImage
                        // profileImageUrl={account.profiles[0]?.images?.[0]?.url}
                        // alternateText={account.profiles[0]?.displayName || ''}
                        alternateText="AS"
                        className="h-full w-full rounded-full object-cover"
                    />
                </div>
                <div className="text-neutral-500 font-medium">
                    {/* { account.profiles[0]?.displayName || '-'} */}
                    Anakin Skywalker
                    {/* <div className="truncate text-sm">
                        {account.profiles[0]?.username && `@${account.profiles[0].username}`}
                    </div> */}
                </div>
            </div>
            <div className="flex flex-row items-center justify-start gap-2 text-neutral-500">
                <div className="relative h-4 w-4">
                    <Envelope />
                </div>
                annie@kisses.com
            </div>
            <div className="flex flex-row items-center justify-start gap-2 mb-2 text-neutral-500">
                <div className="relative h-4 w-4">
                    <Phone />
                </div>
                123 456 7890
            </div>
            <div className="flex flex-row items-center justify-start gap-2 text-neutral-500">
                <Badge
                    variant="success"
                    size="sm"
                >
                    Affiliate
                </Badge>
                <Badge
                    variant="info"
                    size="sm"
                >
                    Subscriber
                </Badge>
            </div>
        </div>
    );
};