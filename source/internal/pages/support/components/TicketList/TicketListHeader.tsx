// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { BorderContainer } from '../BorderContainer';
import { InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Constants
import { STATUS_OPTIONS } from '@structure/source/internal/pages/support/constants';

// Component - TicketListHeader
export interface TicketListHeaderInterface {
    isRefreshing: boolean;
    onRefresh: () => void;
    onStatusChange: (value: string) => void;
}
export function TicketListHeader(properties: TicketListHeaderInterface) {
    const { isRefreshing, onRefresh, onStatusChange } = properties;

    // Render the component
    return (
        <BorderContainer>
            <div className="flex items-center">
                <div className="group flex cursor-pointer items-center" onClick={onRefresh}>
                    <h2 className="text-base font-medium">Tickets</h2>
                    {isRefreshing && <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin" />}
                </div>
            </div>

            <div className="ml-4 w-[140px]">
                <InputSelect
                    className="w-full"
                    items={STATUS_OPTIONS}
                    defaultValue="Open"
                    onChange={function (value) {
                        onStatusChange(value || 'Open');
                    }}
                />
            </div>
        </BorderContainer>  
    );
}
