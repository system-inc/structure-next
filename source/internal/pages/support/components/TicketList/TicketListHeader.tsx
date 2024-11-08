// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Constants
const STATUS_OPTIONS = [
    { value: 'Open', content: 'Open Tickets' },
    { value: 'Closed', content: 'Closed Tickets' },
    { value: 'Deleted', content: 'Deleted Tickets' },
];

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
        <>
            <div className="flex items-center justify-between pb-3 pl-4 pr-4 pt-3">
                <div className="group flex cursor-pointer items-center" onClick={onRefresh}>
                    <h2 className="text-xl font-medium">Support Tickets</h2>
                    {isRefreshing && <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin" />}
                </div>
            </div>

            <div className="mb-3 px-4">
                <InputSelect
                    className="w-full"
                    items={STATUS_OPTIONS}
                    defaultValue="Open"
                    onChange={function (value) {
                        onStatusChange(value || 'Open');
                    }}
                />
            </div>
        </>
    );
}
