'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CustomerTicketHeader } from './CustomerAndTicketSidePanelHeader';
import { CustomerDetails } from './CustomerView/CustomerDetails';
import { CustomerOrdersList } from './CustomerView/CustomerOrdersList';
import { TicketDetails } from './TicketView/TicketDetails';

// Dependencies - Enums
import { CustomerAndTicketSidePanelView } from './CustomerAndTicketSidePanelTypes';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketAccountAndCommerceOrdersPrivelegedQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { usePrevious } from '@structure/source/utilities/React';

// Component - CustomerTicketDetails
export interface CustomerTicketDetailsInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0];
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged'];
    commerceOrders?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['commerceOrdersPrivileged']['items'];
}
export function CustomerAndTicketSidePanel(properties: CustomerTicketDetailsInterface) {
    const previousTicketId = usePrevious(properties.ticket?.id);

    const [selectedView, setSelectedView] = React.useState<CustomerAndTicketSidePanelView>(
        CustomerAndTicketSidePanelView.Customer,
    );

    return (
        <div className="relative h-full overflow-hidden border-l border-light-3 dark:border-dark-3">
            <CustomerTicketHeader selectedView={selectedView} onViewChange={setSelectedView} />
            {selectedView === CustomerAndTicketSidePanelView.Customer && (
                <>
                    <CustomerDetails account={properties.account} />
                    <CustomerOrdersList
                        orders={properties.commerceOrders}
                        changed={properties.ticket?.id !== previousTicketId}
                    />
                </>
            )}
            {selectedView === CustomerAndTicketSidePanelView.Ticket && <TicketDetails ticket={properties.ticket} />}
        </div>
    );
}
