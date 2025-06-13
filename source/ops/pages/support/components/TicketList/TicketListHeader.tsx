// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { BorderContainer } from '../BorderContainer';
import { InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - API
import { SupportTicketStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Constants
import { ticketStatusOptions } from '@structure/source/ops/pages/support/constants';

// Component - TicketListHeader
export interface TicketListHeaderProperties {
    selectedStatus: SupportTicketStatus;
    isRefreshing: boolean;
    onRefresh: () => void;
    onStatusChange: (value: SupportTicketStatus) => void;
}
export function TicketListHeader(properties: TicketListHeaderProperties) {
    // Render the component
    return (
        <BorderContainer>
            <div className="flex items-center">
                <div className="group flex cursor-pointer items-center" onClick={properties.onRefresh}>
                    <h2 className="text-base font-medium">Tickets</h2>
                    {properties.isRefreshing && <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin" />}
                </div>
            </div>

            <div className="ml-4 w-[140px]">
                <InputSelect
                    className="w-full"
                    items={ticketStatusOptions}
                    defaultValue={properties.selectedStatus}
                    onChange={function (value) {
                        properties.onStatusChange((value as SupportTicketStatus) || SupportTicketStatus.Open);
                    }}
                />
            </div>
        </BorderContainer>
    );
}
