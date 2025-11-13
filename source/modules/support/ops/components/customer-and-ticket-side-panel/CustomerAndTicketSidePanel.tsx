'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { CustomerTicketHeader } from './CustomerAndTicketSidePanelHeader';
import { CustomerDetails } from './customer/CustomerDetails';
import { TicketDetails } from './ticket/TicketDetails';

// Dependencies - Enums
import { CustomerAndTicketSidePanelView } from './CustomerAndTicketSidePanelTypes';

// Dependencies - API
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - CustomerTicketDetails
export interface CustomerTicketDetailsProperties {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0];
}
export function CustomerAndTicketSidePanel(properties: CustomerTicketDetailsProperties) {
    const [selectedView, setSelectedView] = React.useState<CustomerAndTicketSidePanelView>(
        CustomerAndTicketSidePanelView.Customer,
    );

    return (
        <div className="relative h-full overflow-hidden border-l border--3">
            <CustomerTicketHeader selectedView={selectedView} onViewChange={setSelectedView} />
            {selectedView === CustomerAndTicketSidePanelView.Customer && <CustomerDetails ticket={properties.ticket} />}
            {selectedView === CustomerAndTicketSidePanelView.Ticket && <TicketDetails ticket={properties.ticket} />}
        </div>
    );
}
