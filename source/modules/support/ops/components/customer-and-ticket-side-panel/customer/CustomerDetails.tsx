'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - API
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import { Envelope } from '@phosphor-icons/react';
import { BorderContainer } from '../../BorderContainer';

// Component - CustomerDetails
interface CustomerDetailsProperties {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0];
}
export function CustomerDetails(properties: CustomerDetailsProperties) {
    return (
        <>
            {properties.ticket ? (
                <div className="flex flex-col gap-4 border-b px-4 pt-3 pb-6">
                    <div className="flex flex-row items-center justify-start gap-2 content--2">
                        <div className="relative h-4 w-4">
                            <Envelope />
                        </div>
                        {properties.ticket.userEmailAddress}
                    </div>
                </div>
            ) : (
                <BorderContainer>No customer information found</BorderContainer>
            )}
        </>
    );
}
