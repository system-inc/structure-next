// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import { formatDateWithTimeIfToday } from '@structure/source/utilities/Time';

// Component - TicketListItem
export interface TicketListItemInterface {
    ticket: {
        id: string;
        userEmailAddress: string;
        title: string;
        createdAt: string;
        comments: {
            content: string;
        }[];
    };
    isSelected: boolean;
    isFirst: boolean;
    onSelect: (id: string) => void;
}
export function TicketListItem(properties: TicketListItemInterface) {
    const { ticket, isSelected, isFirst, onSelect } = properties;
    const lastTicketComment = ticket.comments[ticket.comments.length - 1];
    const createdAtDate = new Date(ticket.createdAt);

    // Render the component
    return (
        <div
            className={`cursor-pointer my-3 mx-4 py-2 pl-12 pr-3 rounded-lg transition-colors hover:bg-light-1 active:bg-light-1 dark:active:bg-dark-2 ${
                isSelected ? 'bg-light-1 dark:bg-dark-2' : 'border-light-3 dark:border-dark-3 dark:hover:bg-dark-1'
            }`}
            onClick={() => onSelect(ticket.id)}
        >
            <div className="mb-1.5 flex items-center justify-between">
                <p className="neutral text-xs">{ticket.userEmailAddress}</p>
                <p className="neutral text-xs">{formatDateWithTimeIfToday(createdAtDate)}</p>
            </div>
            <h4 className="text-sm font-medium">{ticket.title}</h4>
            {lastTicketComment?.content && (
                <p className="neutral mt-1.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
                    {extractLatestEmailContent(lastTicketComment?.content)}
                </p>
            )}
        </div>
    );
}
