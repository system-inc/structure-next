'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - CustomerTicket
import { CustomerAndTicketSidePanelView } from './CustomerAndTicketSidePanelTypes';

// Dependencies - Main Components
import { ToggleGroup, ToggleGroupItem } from '@structure/source/components/buttons/ToggleGroup';
import { BorderContainer } from '../BorderContainer';

// Component - CustomerTicketHeader
interface CustomerTicketHeaderProperties {
    selectedView: CustomerAndTicketSidePanelView;
    onViewChange: (view: CustomerAndTicketSidePanelView) => void;
}
export function CustomerTicketHeader(properties: CustomerTicketHeaderProperties) {
    // Function to handle the user changing the view
    function handleUpdateView(view: string) {
        properties.onViewChange(view as CustomerAndTicketSidePanelView);
    }

    // Render the component
    return (
        <BorderContainer>
            <ToggleGroup className="mr-9" value={properties.selectedView} onValueChange={handleUpdateView}>
                <ToggleGroupItem value={CustomerAndTicketSidePanelView.Customer}>Customer</ToggleGroupItem>
                <ToggleGroupItem value={CustomerAndTicketSidePanelView.Ticket}>Ticket</ToggleGroupItem>
            </ToggleGroup>
        </BorderContainer>
    );
}
