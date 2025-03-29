'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CustomerTicketHeader } from './CustomerTicketDetailsHeader';
import { CustomerDetails } from './CustomerDetails';
import { CustomerOrdersList } from './CustomerOrdersList';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Hooks
import usePrevious from '@project/source/utilities/react/usePrevious';

// Component - CustomerTicketDetails
export interface CustomerTicketDetailsInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]
}
export function CustomerTicketDetails(properties: CustomerTicketDetailsInterface) {
    const previousTicketId = usePrevious(properties.ticket?.id);

    return (
        <div className="relative h-full overflow-hidden border-l border-light-3 dark:border-dark-3">
            <CustomerTicketHeader />
            <CustomerDetails />
            <CustomerOrdersList changed={properties.ticket?.id !== previousTicketId} />
        </div>
    );
}